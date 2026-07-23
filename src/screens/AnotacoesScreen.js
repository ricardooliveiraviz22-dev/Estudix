// ============================================================
//  ESTUDIX — AnotacoesScreen
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import FAB from '../components/FAB';
import AnimatedPressable from '../components/AnimatedPressable';
import Card from '../components/Card';
import Chip from '../components/Chip';
import Input from '../components/Input';
import Button from '../components/Button';
import ModalSheet from '../components/ModalSheet';
import EmptyState from '../components/EmptyState';
import { useScreenEnter } from '../hooks/useScreenEnter';
import { useEstudix, formatRelativeDate } from '../context/EstudixContext';
import { colors, fontFamily, fontSize, spacing, radii } from '../theme';

export default function AnotacoesScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { state, saveAnotacao, deleteAnotacao, setNotesFilter } = useEstudix();
  const { notesFilter } = state;

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [materiaId, setMateriaId] = useState('');

  const openModal = (nota = null) => {
    if (nota) {
      setEditingId(nota.id);
      setTitle(nota.title);
      setContent(nota.content);
      setMateriaId(nota.materiaId || '');
    } else {
      setEditingId(null);
      setTitle('');
      setContent('');
      setMateriaId('');
    }
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    saveAnotacao(title, content, materiaId || state.materias[0]?.id, editingId);
    setModalVisible(false);
  };

  const getMateriaColor = (id) => {
    const m = state.materias.find(m => m.id === id);
    return m ? m.color : colors.accent;
  };

  const getMateriaName = (id) => {
    const m = state.materias.find(m => m.id === id);
    return m ? m.name : 'Geral';
  };

  const filteredNotes = notesFilter === 'all'
    ? state.anotacoes
    : state.anotacoes.filter(n => n.materiaId === notesFilter);

  const sortedNotes = [...filteredNotes].sort((a, b) => b.createdAt - a.createdAt);
  const enterStyle = useScreenEnter();

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom }]}>
      <AppHeader navigation={navigation} showBack={false} />

      <Animated.ScrollView contentContainerStyle={styles.content} style={enterStyle}>
        <Text style={styles.title}>Anotações</Text>
        <Text style={styles.subtitle}>Registre resumos, dúvidas e pensamentos de estudo.</Text>

        <Animated.ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.notesFilterRow}>
          <Chip label="Todas" active={notesFilter === 'all'} onPress={() => setNotesFilter('all')} style={{ marginRight: 8 }} />
          {state.materias.map(mat => (
            <Chip
              key={mat.id}
              label={mat.name}
              active={notesFilter === mat.id}
              activeColor={mat.color}
              onPress={() => setNotesFilter(mat.id)}
              style={{ marginRight: 8 }}
            />
          ))}
        </Animated.ScrollView>

        {sortedNotes.length === 0 ? (
          <EmptyState
            icon="file-text"
            title="Nenhuma anotação ainda"
            description={notesFilter !== 'all' ? 'Nenhuma anotação nesta matéria por enquanto.' : 'Comece registrando um resumo ou uma dúvida de estudo.'}
            actionLabel="Nova anotação"
            onAction={() => openModal()}
          />
        ) : (
          sortedNotes.map(nota => {
            const color = getMateriaColor(nota.materiaId);
            return (
              <AnimatedPressable
                key={nota.id}
                style={[styles.noteCard, { borderLeftColor: color }]}
                onPress={() => openModal(nota)}
              >
                <View style={styles.noteCardHeader}>
                  <Text style={[styles.noteCardTitle, { color }]}>{nota.title}</Text>
                  <TouchableOpacity onPress={() => deleteAnotacao(nota.id)} style={styles.noteDeleteBtn}>
                    <Feather name="trash-2" size={14} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.noteCardContent} numberOfLines={3}>{nota.content}</Text>

                <View style={styles.noteCardFooter}>
                  <View style={[styles.badge, { backgroundColor: color + '14' }]}>
                    <Text style={[styles.badgeText, { color }]}>{getMateriaName(nota.materiaId)}</Text>
                  </View>
                  <Text style={styles.cardDate}>{formatRelativeDate(nota.createdAt)}</Text>
                </View>
              </AnimatedPressable>
            );
          })
        )}
        <View style={{ height: 130 }} />
      </Animated.ScrollView>

      <FAB currentScreen="Anotacoes" onPress={() => openModal()} />

      <ModalSheet visible={modalVisible} onClose={() => setModalVisible(false)} title={editingId ? 'Editar anotação' : 'Nova anotação'}>
        <Input placeholder="Título..." value={title} onChangeText={setTitle} />
        <Input placeholder="Escreva sua anotação..." multiline value={content} onChangeText={setContent} />

        <Text style={styles.label}>Matéria</Text>
        <Animated.ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollSelector}>
          <Chip label="Geral" active={!materiaId} onPress={() => setMateriaId('')} style={{ marginRight: 8 }} />
          {state.materias.map(mat => (
            <Chip
              key={mat.id}
              label={mat.name}
              active={materiaId === mat.id}
              activeColor={mat.color}
              onPress={() => setMateriaId(mat.id)}
              style={{ marginRight: 8 }}
            />
          ))}
        </Animated.ScrollView>

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
  content: { padding: 8, paddingHorizontal: 20 },
  title: { fontFamily: fontFamily.serif, fontSize: 28, color: colors.text, marginBottom: 4 },
  subtitle: { fontFamily: fontFamily.regular, fontSize: 13, color: colors.textMuted, lineHeight: 20, marginBottom: 20 },

  notesFilterRow: { flexDirection: 'row', marginBottom: 16, paddingBottom: 4 },

  noteCard: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
    borderRadius: radii.lg, padding: 16, marginBottom: 12,
    borderLeftWidth: 3,
  },
  noteCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  noteCardTitle: { fontFamily: fontFamily.semibold, fontSize: 15, flex: 1, paddingRight: 8 },
  noteDeleteBtn: { padding: 4, borderRadius: 6 },
  noteCardContent: { fontFamily: fontFamily.regular, fontSize: 13, color: colors.text, lineHeight: 22, marginBottom: 10 },
  noteCardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardDate: { fontFamily: fontFamily.medium, fontSize: 11, color: colors.textMuted },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radii.pill },
  badgeText: { fontFamily: fontFamily.semibold, fontSize: 11 },

  label: { fontFamily: fontFamily.semibold, fontSize: 11, color: colors.textMuted, marginBottom: 8, textTransform: 'uppercase' },
  scrollSelector: { flexDirection: 'row', marginBottom: 16 },

  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.sm, marginTop: 8 },
});
