// ============================================================
//  ESTUDIX — Notificações locais
//  Fim de sessão do Pomodoro e lembrete de evento do calendário.
//  Tudo local (sem servidor push) via expo-notifications.
// ============================================================

import { Platform } from 'react-native';
import { isRunningInExpoGo } from 'expo';

// Desde o SDK 53, o expo-notifications registra automaticamente (no escopo
// do próprio módulo, ao ser importado) um listener de push token para
// auto-sincronização com servidor. No Expo Go em Android essa função
// (addPushTokenListener) lança uma exceção síncrona, pois push remoto foi
// removido do Expo Go nessa plataforma — isso acontece mesmo que o app nunca
// chame nenhuma API de push, só de importar o pacote. Notificações locais
// (as únicas usadas aqui) continuam suportadas em todo o resto (Expo Go
// iOS, Development Build e produção em ambas as plataformas), então
// adiamos o `require` do módulo nativo para não disparar esse efeito
// colateral quando estivermos exatamente nessa combinação incompatível.
const PUSH_MODULE_UNAVAILABLE = Platform.OS === 'android' && isRunningInExpoGo();

const Notifications = PUSH_MODULE_UNAVAILABLE ? null : require('expo-notifications');

if (Notifications) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function initNotifications() {
  if (!Notifications) return;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('estudix', {
      name: 'Estudix',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
  }
}

async function ensurePermission() {
  if (!Notifications) return false;
  const { status } = await Notifications.getPermissionsAsync();
  if (status === 'granted') return true;
  const { status: requested } = await Notifications.requestPermissionsAsync();
  return requested === 'granted';
}

// ── Pomodoro ────────────────────────────────────────────────
export async function scheduleFocusEndNotification(seconds, title, body) {
  if (seconds <= 0) return null;
  const allowed = await ensurePermission();
  if (!allowed) return null;
  try {
    return await Notifications.scheduleNotificationAsync({
      content: { title, body, sound: true },
      trigger: { seconds, channelId: 'estudix' },
    });
  } catch (e) {
    console.error('Falha ao agendar notificação do timer:', e);
    return null;
  }
}

export async function cancelNotification(id) {
  if (!id || !Notifications) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch (e) {
    // notificação já disparou ou foi cancelada — ignora
  }
}

// ── Eventos do calendário ───────────────────────────────────
// Agenda um lembrete às 8h do dia do evento, se a data ainda não passou.
export async function scheduleEventReminder(event) {
  const allowed = await ensurePermission();
  if (!allowed) return null;

  const [y, m, d] = event.date.split('-').map(Number);
  const triggerDate = new Date(y, m - 1, d, 8, 0, 0);
  if (triggerDate.getTime() <= Date.now()) return null;

  try {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: `Hoje: ${event.title}`,
        body: event.description || 'Não esqueça do seu compromisso.',
        sound: true,
      },
      trigger: { channelId: 'estudix', date: triggerDate },
    });
  } catch (e) {
    console.error('Falha ao agendar lembrete de evento:', e);
    return null;
  }
}
