// ============================================================
//  ESTUDIX — CalendarioScreen
// ============================================================
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
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
import { useEstudix, formatDate } from '../context/EstudixContext';
import { colors, fontFamily, fontSize, spacing, radii } from '../theme';

const EVENT_TYPES = ['prova', 'trabalho', 'atividade', 'aula', 'evento'];
const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

export default function CalendarioScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { state, saveEvent, deleteEvent, prevMonth, nextMonth, setCalSelectedDate } = useEstudix();
  const { viewYear, viewMonth, calSelectedDate } = state.calendar;

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventType, setEventType] = useState('evento');
  const [materiaId, setMateriaId] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const today = new Date();
  const pad = (n) => String(n).padStart(2, '0');

  const handleDateChange = (event, selected) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (event.type === 'dismissed' || !selected) return;
    setEventDate(`${selected.getFullYear()}-${pad(selected.getMonth() + 1)}-${pad(selected.getDate())}`);
  };

  const openModal = (ev = null) => {
    if (ev) {
      setEditingId(ev.id);
      setEventTitle(ev.title);
      setEventDescription(ev.description || '');
      setEventDate(ev.date);
      setEventType(ev.type || 'evento');
      setMateriaId(ev.materiaId || '');
    } else {
      setEditingId(null);
      setEventTitle('');
      setEventDescription('');
      setEventDate(calSelectedDate);
      setEventType('evento');
      setMateriaId('');
    }
    setShowDatePicker(false);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!eventTitle.trim() || !eventDate.trim()) return;
    saveEvent(eventTitle, eventDescription, eventDate, eventType, materiaId, editingId);
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

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    const prevDate = new Date(viewYear, viewMonth, -firstDay + i + 1);
    cells.push({ type: 'empty', day: prevDate.getDate(), id: `empty-${i}` });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${viewYear}-${pad(viewMonth + 1)}-${pad(d)}`;
    const isToday = today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === d;
    const hasEvent = state.calendar.events.some(e => e.date === dateStr);
    cells.push({ type: 'day', day: d, dateStr, isToday, hasEvent });
  }

  const selectedEvents = state.calendar.events.filter(e => e.date === calSelectedDate);
  const enterStyle = useScreenEnter();

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom }]}>
      <AppHeader navigation={navigation} showBack={true} />

      <Animated.ScrollView contentContainerStyle={styles.content} style={enterStyle}>

        <Card style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={prevMonth} style={styles.iconBtn}>
              <Feather name="chevron-left" size={18} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.calendarMonthTitle}>{MONTH_NAMES[viewMonth]} {viewYear}</Text>
            <TouchableOpacity onPress={nextMonth} style={styles.iconBtn}>
              <Feather name="chevron-right" size={18} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.calendarGridWeek}>
            {['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(d => (
              <Text key={d} style={styles.calendarWeekText}>{d}</Text>
            ))}
          </View>

          <View style={styles.calendarGridDays}>
            {cells.map((cell) => {
              if (cell.type === 'empty') {
                return (
                  <View key={cell.id} style={[styles.calDayCell, { opacity: 0.3 }]}>
                    <Text style={styles.calDayNum}>{cell.day}</Text>
                  </View>
                );
              }
              const isSelected = calSelectedDate === cell.dateStr;
              return (
                <AnimatedPressable
                  key={cell.dateStr}
                  style={[
                    styles.calDayCell,
                    cell.isToday && styles.calDayToday,
                    isSelected && styles.calDaySelected
                  ]}
                  onPress={() => setCalSelectedDate(cell.dateStr)}
                >
                  <Text style={[styles.calDayNum, (cell.isToday || isSelected) && { color: colors.accent }]}>
                    {cell.day}
                  </Text>
                  {cell.hasEvent && <View style={styles.calDayEventDot} />}
                </AnimatedPressable>
              );
            })}
          </View>
        </Card>

        <View style={[styles.sectionHeader, { marginTop: 20 }]}>
          <Feather name="list" size={13} color={colors.textMuted} style={{ marginRight: 6 }} />
          <Text style={styles.sectionTitle}>Eventos do dia</Text>
        </View>

        {selectedEvents.length === 0 ? (
          <EmptyState icon="calendar" title="Nenhum evento neste dia" description="Toque no botão abaixo para adicionar uma prova, tarefa ou lembrete." actionLabel="Novo evento" onAction={() => openModal()} />
        ) : (
          selectedEvents.map(ev => {
            const color = getMateriaColor(ev.materiaId);
            return (
              <AnimatedPressable key={ev.id} style={[styles.card, { borderLeftColor: color }]} onPress={() => openModal(ev)}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardDate}>{formatDate(ev.date)}</Text>
                  <TouchableOpacity onPress={() => deleteEvent(ev.id)}>
                    <Feather name="trash-2" size={14} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.cardTitle}>{ev.title}</Text>
                {!!ev.description && <Text style={styles.cardDesc}>{ev.description}</Text>}

                <View style={styles.cardFooter}>
                  <View style={[styles.badge, { backgroundColor: color + '14' }]}>
                    <Text style={[styles.badgeText, { color }]}>{getMateriaName(ev.materiaId)}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: colors.surfaceMuted }]}>
                    <Text style={[styles.badgeText, { color: colors.textMuted, textTransform: 'capitalize' }]}>{ev.type || 'evento'}</Text>
                  </View>
                </View>
              </AnimatedPressable>
            );
          })
        )}
        <View style={{ height: 120 }} />
      </Animated.ScrollView>

      <FAB currentScreen="Calendario" onPress={() => openModal()} />

      <ModalSheet visible={modalVisible} onClose={() => setModalVisible(false)} title={editingId ? 'Editar evento' : 'Novo evento'}>
        <Input placeholder="Título do evento..." value={eventTitle} onChangeText={setEventTitle} />
        <Input placeholder="Descrição (opcional)..." value={eventDescription} onChangeText={setEventDescription} multiline />

        <AnimatedPressable style={styles.dateField} onPress={() => setShowDatePicker(true)}>
          <Feather name="calendar" size={16} color={colors.textMuted} />
          <Text style={[styles.dateFieldText, !eventDate && { color: colors.textFaint }]}>
            {eventDate ? formatDate(eventDate) : 'Selecionar data'}
          </Text>
        </AnimatedPressable>

        {showDatePicker && (
          <View style={Platform.OS === 'ios' ? styles.iosPickerWrap : undefined}>
            <DateTimePicker
              value={eventDate ? new Date(`${eventDate}T00:00:00`) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={handleDateChange}
              locale="pt-BR"
            />
            {Platform.OS === 'ios' && (
              <TouchableOpacity style={styles.iosPickerDone} onPress={() => setShowDatePicker(false)}>
                <Text style={styles.iosPickerDoneText}>Concluir</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <Text style={styles.label}>Tipo de evento</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollSelector}>
          {EVENT_TYPES.map(type => (
            <Chip key={type} label={type} active={eventType === type} onPress={() => setEventType(type)} style={{ marginRight: 8 }} />
          ))}
        </ScrollView>

        <Text style={styles.label}>Matéria</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollSelector}>
          <Chip label="Geral" active={!materiaId} onPress={() => setMateriaId('')} style={{ marginRight: 8 }} />
          {state.materias.map(mat => (
            <Chip key={mat.id} label={mat.name} active={materiaId === mat.id} activeColor={mat.color} onPress={() => setMateriaId(mat.id)} style={{ marginRight: 8 }} />
          ))}
        </ScrollView>

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
  content: { paddingHorizontal: 20, paddingTop: 8 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', paddingBottom: 8, marginBottom: 12 },
  sectionTitle: { fontFamily: fontFamily.semibold, fontSize: 12, color: colors.textMuted, letterSpacing: 0.3 },

  calendarCard: { padding: 14, marginBottom: 16 },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  calendarMonthTitle: { fontSize: 15, fontFamily: fontFamily.semibold, color: colors.text },
  iconBtn: { padding: 6, borderRadius: 8 },
  calendarGridWeek: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  calendarWeekText: { width: '14.28%', textAlign: 'center', fontFamily: fontFamily.semibold, fontSize: 11, color: colors.textMuted },

  calendarGridDays: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, justifyContent: 'space-between' },
  calDayCell: { width: '13%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: radii.sm },
  calDayToday: { backgroundColor: colors.accentMuted },
  calDaySelected: { borderWidth: 1.5, borderColor: colors.accent },
  calDayNum: { fontFamily: fontFamily.medium, fontSize: 13, color: colors.text },
  calDayEventDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.accent, position: 'absolute', bottom: 4 },

  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, padding: 16, borderRadius: radii.lg, borderLeftWidth: 3, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  cardDate: { fontFamily: fontFamily.semibold, fontSize: 12, color: colors.accent, textTransform: 'uppercase' },
  cardTitle: { fontFamily: fontFamily.semibold, fontSize: 15, color: colors.text, marginBottom: 4 },
  cardDesc: { fontFamily: fontFamily.regular, fontSize: 13, color: colors.textMuted, marginBottom: 12, lineHeight: 20 },
  cardFooter: { flexDirection: 'row', gap: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radii.pill },
  badgeText: { fontFamily: fontFamily.semibold, fontSize: 11 },

  dateField: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border,
    borderRadius: radii.md, paddingHorizontal: spacing.md, paddingVertical: 12,
    marginBottom: spacing.md,
  },
  dateFieldText: { fontFamily: fontFamily.medium, fontSize: fontSize.base, color: colors.text },
  iosPickerWrap: { backgroundColor: colors.surfaceMuted, borderRadius: radii.md, marginBottom: spacing.md, overflow: 'hidden' },
  iosPickerDone: { alignItems: 'flex-end', paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  iosPickerDoneText: { fontFamily: fontFamily.semibold, fontSize: fontSize.sm, color: colors.accent },
  label: { fontFamily: fontFamily.semibold, fontSize: fontSize.xs, color: colors.textMuted, marginBottom: 8, textTransform: 'uppercase' },
  scrollSelector: { flexDirection: 'row', marginBottom: spacing.md },

  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.sm, marginTop: spacing.sm },
});
