/**
 * Service de notifications : TOUT le code qui parle au système de notifications du téléphone.
 * (Les dossiers : lib/ = calculs purs, testables ; services/ = échanges avec le téléphone.)
 * Doc SDK 57 : https://docs.expo.dev/versions/v57.0.0/sdk/notifications/
 */
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { buildReminderContent, toHourMinute } from "@/lib/reminder-content";

/** Le « canal » Android de nos rappels (obligatoire depuis Android 8). */
const REMINDER_CHANNEL_ID = "daily-reminder";

/** Le NOM de la notification « vies rechargées » : il permet de l'annuler sans toucher au rappel. */
const HEARTS_NOTIFICATION_ID = "hearts-full";

/**
 * À appeler UNE fois au démarrage : dit au téléphone d'afficher nos notifications
 * même quand l'app est ouverte (sinon elles seraient ignorées au premier plan).
 */
export function configureNotifications(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

/**
 * Demande la permission d'envoyer des notifications (seulement si on ne l'a pas déjà).
 * `async` : la fonction attend la réponse de l'utilisateur → elle renvoie une « promesse » (Promise).
 */
async function ensurePermission(): Promise<boolean> {
  // Android : le canal doit exister AVANT de demander la permission (Android 13+)
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL_ID, {
      name: "Rappel quotidien",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  // `await` : on attend la réponse avant de continuer (le reste de l'app ne se bloque pas pour autant)
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false; // l'utilisateur a refusé : on ne peut plus demander

  const answer = await Notifications.requestPermissionsAsync();
  return answer.granted;
}

type ReminderSettings = { enabled: boolean; timeMinutes: number; lessonMinutes: number };

/** La dernière synchronisation lancée : la suivante attend qu'elle soit finie (file d'attente). */
let lastSync: Promise<unknown> = Promise.resolve();

/**
 * Met le rappel du téléphone en accord avec les réglages :
 * - rappel activé → annule l'ancien et programme le nouveau, tous les jours à l'heure choisie ;
 * - rappel désactivé → annule tout.
 * Les appels sont mis en FILE : si on touche « + » trois fois très vite, les synchronisations
 * se font l'une APRÈS l'autre (sinon elles pourraient se croiser et laisser deux rappels).
 * Renvoie true si un rappel est bien programmé.
 */
export function syncDailyReminder(settings: ReminderSettings): Promise<boolean> {
  const run = lastSync.then(() => applyReminder(settings));
  lastSync = run.catch(() => undefined); // une erreur ne doit pas bloquer les suivantes
  return run;
}

async function applyReminder(settings: ReminderSettings): Promise<boolean> {
  // On repart toujours de zéro : jamais deux rappels en double.
  // On annule TOUT SAUF la notification des vies (sinon le rappel l'effacerait).
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const request of scheduled) {
    if (request.identifier !== HEARTS_NOTIFICATION_ID) {
      await Notifications.cancelScheduledNotificationAsync(request.identifier);
    }
  }
  if (!settings.enabled) return false;

  const hasPermission = await ensurePermission();
  if (!hasPermission) return false;

  const { hour, minute } = toHourMinute(settings.timeMinutes);
  await Notifications.scheduleNotificationAsync({
    content: buildReminderContent(settings.lessonMinutes),
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: REMINDER_CHANNEL_ID,
    },
  });
  return true;
}

/**
 * Programme « Tes 5 vies sont rechargées ! » à l'heure `fullAt` (en ms).
 * On ne demande PAS la permission ici (pas de fenêtre surprise) : on envoie seulement
 * si l'utilisateur a déjà accepté les notifications (avec le rappel quotidien).
 */
export async function scheduleHeartsFullNotification(fullAt: number): Promise<void> {
  await cancelHeartsFullNotification(); // annuler puis reprogrammer : jamais deux en double
  const permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) return;

  await Notifications.scheduleNotificationAsync({
    identifier: HEARTS_NOTIFICATION_ID,
    content: {
      title: "Tes 5 vies sont rechargées ! ❤️",
      body: "Le lion t'attend : reprends ta leçon de wolof.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: fullAt,
      channelId: REMINDER_CHANNEL_ID,
    },
  });
}

/** Annule la notification des vies (sans erreur s'il n'y en a pas). */
export async function cancelHeartsFullNotification(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(HEARTS_NOTIFICATION_ID);
}

/** Outil de test (menu développeur) : envoie le rappel dans quelques secondes. */
export async function sendTestReminder(lessonMinutes: number, delaySeconds = 5): Promise<boolean> {
  if (!(await ensurePermission())) return false;
  await Notifications.scheduleNotificationAsync({
    content: buildReminderContent(lessonMinutes),
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: delaySeconds,
      channelId: REMINDER_CHANNEL_ID,
    },
  });
  return true;
}
