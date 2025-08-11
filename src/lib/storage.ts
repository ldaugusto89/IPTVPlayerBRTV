import AsyncStorage from '@react-native-async-storage/async-storage';

const LIST_URL_KEY = 'user_list_url';

export async function saveListUrl(url: string) {
  try {
    await AsyncStorage.setItem(LIST_URL_KEY, url);
  } catch (error) {
    console.error('Erro ao salvar URL da lista:', error);
  }
}

export async function getSavedListUrl(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(LIST_URL_KEY);
  } catch (error) {
    console.error('Erro ao obter URL da lista:', error);
    return null;
  }
}

export async function clearSavedListUrl() {
  try {
    await AsyncStorage.removeItem(LIST_URL_KEY);
  } catch (error) {
    console.error('Erro ao limpar URL da lista:', error);
  }
}

