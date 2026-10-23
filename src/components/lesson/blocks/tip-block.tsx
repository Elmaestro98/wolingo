import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import { CONTENT_IMAGES, type ContentImageName } from "@/content/images";

type TipBlockProps = {
  speaker: string;
  image?: ContentImageName;
  text: string;
};

/** Bloc « astuce » : un personnage (ou une ampoule) qui donne un conseil. */
export function TipBlock({ speaker, image, text }: TipBlockProps) {
  return (
    <View className="flex-row items-start gap-3 rounded-[18px] bg-white p-3.5">
      {image ? (
        <Image source={CONTENT_IMAGES[image]} className="h-11 w-11 rounded-full" />
      ) : (
        <View className="h-11 w-11 items-center justify-center rounded-full bg-yellow-light">
          <Ionicons name="bulb-outline" size={20} color={Colors.yellowText} />
        </View>
      )}
      <Text className="flex-1 font-body text-sm leading-5 text-[#3D3730]">
        <Text className="font-body-black text-green">{speaker} : </Text>
        {text}
      </Text>
    </View>
  );
}
