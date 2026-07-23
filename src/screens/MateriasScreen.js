// ============================================================
//  ESTUDIX — MateriasScreen
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, Animated, Image, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

import AppHeader from '../components/AppHeader';
import FAB from '../components/FAB';
import AnimatedPressable from '../components/AnimatedPressable';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import ModalSheet from '../components/ModalSheet';
import EmptyState from '../components/EmptyState';
import { useScreenEnter } from '../hooks/useScreenEnter';
import { useEstudix } from '../context/EstudixContext';
import { colors, fontFamily, fontSize, spacing, radii } from '../theme';

export default function MateriasScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { state, saveMateria, setSelectedMateria, calcularMedia, updateMateriaImage } = useEstudix();
  const { materias } = state;

  const [modalVisible, setModalVisible] = useState(false);
  const [newMateriaName, setNewMateriaName] = useState('');

  const handlePickImage = async (materiaId) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });

    if (!result.canceled) {
      updateMateriaImage(materiaId, result.assets[0].uri);
    }
  };

  const handleRemoveImage = (materiaId) => {
    updateMateriaImage(materiaId, null);
  };

  const openModal = () => {
    setNewMateriaName('');
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!newMateriaName.trim()) return;
    saveMateria(newMateriaName.trim());
    setModalVisible(false);
  };

  const handleMateriaClick = (id) => {
    setSelectedMateria(id);
    navigation.navigate('MateriaInterna');
  };

  const enterStyle = useScreenEnter();

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom }]}>
      <AppHeader navigation={navigation} showBack={false} />

      <Animated.ScrollView contentContainerStyle={styles.scrollContent} style={enterStyle}>
        <Text style={styles.title}>Minhas Matérias</Text>
        <Text style={styles.subtitle}>Adicione as disciplinas que você está estudando.</Text>

        {materias.length === 0 ? (
          <EmptyState
            icon="book-open"
            title="Nenhuma matéria ainda"
            description="Cadastre a primeira disciplina que você está estudando para começar a acompanhar notas, checklists e flashcards."
            actionLabel="Nova matéria"
            onAction={openModal}
          />
        ) : (
          <View style={styles.grid}>
            {materias.map((mat) => (
              <AnimatedPressable
                key={mat.id}
                style={[styles.card, { borderTopWidth: 3, borderTopColor: mat.color }]}
                onPress={() => handleMateriaClick(mat.id)}
              >
                <Pressable
                  style={styles.photoButton}
                  hitSlop={8}
                  onPress={() => handlePickImage(mat.id)}
                >
                  <Ionicons name="camera-outline" size={13} color={colors.textMuted} />
                </Pressable>

                {mat.imageUri && (
                  <Pressable
                    style={styles.removeButton}
                    hitSlop={8}
                    onPress={() => handleRemoveImage(mat.id)}
                  >
                    <Ionicons name="close" size={13} color={colors.textMuted} />
                  </Pressable>
                )}

                <View style={[styles.iconBox, { backgroundColor: mat.color + '14' }]}>
                  {mat.imageUri ? (
                    <Image source={{ uri: mat.imageUri }} style={styles.iconImage} />
                  ) : (
                    <Ionicons name={mat.icon} size={26} color={mat.color} />
                  )}
                </View>
                <Text style={styles.cardTitle}>{mat.name}</Text>
                <Text style={styles.cardSub}>Média: {calcularMedia(mat.id)}</Text>
              </AnimatedPressable>
            ))}
          </View>
        )}
        <View style={{ height: 120 }} />
      </Animated.ScrollView>

      <FAB currentScreen="Materias" onPress={() => openModal()} />

      <ModalSheet visible={modalVisible} onClose={() => setModalVisible(false)} title="Nova matéria" subtitle="Qual matéria deseja estudar?">
        <Input
          placeholder="Ex: Biologia"
          value={newMateriaName}
          onChangeText={setNewMateriaName}
          autoFocus
        />
        <View style={styles.modalActions}>
          <Button label="Cancelar" onPress={() => setModalVisible(false)} variant="ghost" />
          <Button label="Salvar" onPress={handleSave} />
        </View>
      </ModalSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8 },
  title: { fontFamily: fontFamily.serif, fontSize: 28, color: colors.text, marginBottom: 4 },
  subtitle: { fontFamily: fontFamily.regular, fontSize: 13, color: colors.textMuted, lineHeight: 20, marginBottom: 20 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    width: '47.5%', borderRadius: radii.lg,
    paddingVertical: 18, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'flex-start',
    gap: 4,
  },
  iconBox: { width: 52, height: 52, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center', marginBottom: 10, overflow: 'hidden' },
  iconImage: { width: '100%', height: '100%' },
  photoButton: {
    position: 'absolute', top: 8, right: 8, zIndex: 2,
    width: 24, height: 24, borderRadius: radii.pill,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  removeButton: {
    position: 'absolute', top: 8, left: 8, zIndex: 2,
    width: 24, height: 24, borderRadius: radii.pill,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  cardTitle: { fontFamily: fontFamily.semibold, fontSize: 14, color: colors.text, textAlign: 'center' },
  cardSub: { fontFamily: fontFamily.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 },

  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.sm, marginTop: spacing.sm },
});