import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { Text, View } from 'react-native';

import { Colors, Fonts } from '@/constants/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

// `name` = nom du fichier de la page ; `title` = texte affiché sous l'icône (en français)
const tabs: { name: string; title: string; icon: IconName }[] = [
  { name: 'index', title: 'Parcours', icon: 'map-outline' },
  { name: 'review', title: 'Révision', icon: 'refresh-outline' },
  { name: 'vocabulary', title: 'Lexique', icon: 'book-outline' },
  { name: 'profile', title: 'Profil', icon: 'person-outline' },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.green,
        tabBarInactiveTintColor: Colors.muted,
        tabBarStyle: { backgroundColor: Colors.white, borderTopColor: '#F0EADF', paddingTop: 8 },
        // Laisse assez de place pour la pastille de 56px de large
        tabBarIconStyle: { width: 56, height: 32 },
      }}>
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            // Nos propres fonctions de dessin : la bibliothèque nous dit si l'onglet est actif (`focused`)
            tabBarIcon: ({ focused, color }) => (
              <View
                className={`h-8 w-14 items-center justify-center rounded-full ${focused ? 'bg-green-light' : ''}`}>
                <Ionicons name={tab.icon} color={color as string} size={22} />
              </View>
            ),
            tabBarLabel: ({ focused, color, children }) => (
              <Text style={{ fontFamily: focused ? Fonts.bodyBlack : Fonts.bodyBold, fontSize: 12, color }}>
                {children}
              </Text>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
