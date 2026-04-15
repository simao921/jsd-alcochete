import { useRef, useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { ScanSearch, Sparkles } from "lucide-react-native";

import { AnimatedScreen } from "@/components/AnimatedScreen";
import { GlassCard } from "@/components/GlassCard";
import { GradientButton } from "@/components/GradientButton";
import { SectionHeader } from "@/components/SectionHeader";
import { analyzeMealPhoto } from "@/services/ai/visionService";
import type { MealVisionResult } from "@/types";
import { useAppTheme } from "@/hooks/useAppTheme";

export const ScannerScreen = () => {
  const { theme } = useAppTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [result, setResult] = useState<MealVisionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCapture = async () => {
    try {
      if (!cameraRef.current) {
        return;
      }

      setLoading(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: true
      });

      if (!photo?.base64) {
        throw new Error("Nao foi possivel capturar a foto.");
      }

      setCapturedUri(photo.uri);
      const scan = await analyzeMealPhoto(photo.base64, "image/jpeg");
      setResult(scan);
    } catch (error) {
      Alert.alert("Meal scanner", error instanceof Error ? error.message : "Scanner falhou.");
    } finally {
      setLoading(false);
    }
  };

  if (!permission?.granted) {
    return (
      <AnimatedScreen>
        <SectionHeader
          eyebrow="Food Scanner"
          title="Enable camera access"
          subtitle="The camera powers meal recognition, calorie estimation and instant coaching."
        />
        <GradientButton label="Allow camera" onPress={() => requestPermission()} />
      </AnimatedScreen>
    );
  }

  return (
    <AnimatedScreen>
      <SectionHeader
        eyebrow="Food Scanner"
        title="Capture your plate"
        subtitle="AI vision estimates calories, macros and foods from a real meal photo."
      />

      <View style={styles.cameraShell}>
        <CameraView ref={cameraRef} style={styles.camera} facing="back">
          <View style={styles.overlay}>
            <View style={[styles.scanFrame, { borderColor: theme.colors.primary }]}>
              <View style={[styles.scanLine, { backgroundColor: theme.colors.primary }]} />
            </View>
          </View>
        </CameraView>
      </View>

      <GradientButton label={loading ? "Analyzing meal..." : "Scan this meal"} loading={loading} onPress={handleCapture} />

      {capturedUri ? (
        <GlassCard>
          <Image source={{ uri: capturedUri }} style={styles.preview} />
        </GlassCard>
      ) : null}

      {result ? (
        <GlassCard>
          <View style={styles.resultHeader}>
            <View style={styles.badge}>
              <ScanSearch size={16} color={theme.colors.primary} />
              <Text style={[styles.badgeLabel, { color: theme.colors.primary }]}>Vision estimate</Text>
            </View>
            <Text style={[styles.confidence, { color: theme.colors.textMuted }]}>
              {Math.round(result.confidence * 100)}% confidence
            </Text>
          </View>
          <Text style={[styles.kcal, { color: theme.colors.text }]}>{result.estimatedCalories} kcal</Text>
          <Text style={[styles.foods, { color: theme.colors.textMuted }]}>{result.detectedFoods.join(" • ")}</Text>
          <View style={styles.macroRow}>
            <MacroPill label={`${result.protein}g protein`} />
            <MacroPill label={`${result.carbs}g carbs`} />
            <MacroPill label={`${result.fats}g fats`} />
          </View>
          <View style={styles.tipRow}>
            <Sparkles size={16} color={theme.colors.secondary} />
            <Text style={[styles.tip, { color: theme.colors.text }]}>{result.coachingTip}</Text>
          </View>
        </GlassCard>
      ) : null}
    </AnimatedScreen>
  );
};

const MacroPill = ({ label }: { label: string }) => {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.pill, { backgroundColor: theme.colors.surfaceAlt }]}>
      <Text style={[styles.pillLabel, { color: theme.colors.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cameraShell: {
    borderRadius: 32,
    overflow: "hidden",
    height: 430
  },
  camera: {
    flex: 1
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.15)"
  },
  scanFrame: {
    width: "78%",
    height: "58%",
    borderWidth: 2,
    borderRadius: 28,
    overflow: "hidden",
    justifyContent: "center"
  },
  scanLine: {
    height: 3,
    width: "100%"
  },
  preview: {
    width: "100%",
    height: 220,
    borderRadius: 24
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  badgeLabel: {
    fontSize: 13,
    fontWeight: "800"
  },
  confidence: {
    fontSize: 12,
    fontWeight: "700"
  },
  kcal: {
    marginTop: 14,
    fontSize: 32,
    fontWeight: "900"
  },
  foods: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20
  },
  macroRow: {
    marginTop: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16
  },
  pillLabel: {
    fontSize: 13,
    fontWeight: "700"
  },
  tipRow: {
    marginTop: 18,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start"
  },
  tip: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21
  }
});
