import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import FocusableButton from './FocusableButton';
import { ApiCategory } from '../context/ChannelContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../@types/navigation';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface ContentChannelRowProps {
  title: string;
  items: ApiCategory[];
  navigation: NavigationProp;
  seeAllScreen?: keyof RootStackParamList;
}

const ContentChannelRow = ({ title, items, navigation, seeAllScreen }: ContentChannelRowProps) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {seeAllScreen && (
          <TouchableOpacity onPress={() => navigation.navigate(seeAllScreen as any)}>
            <Text style={styles.seeAll}>Ver Todos</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        horizontal
        data={items}
        renderItem={({ item }) => (
          <FocusableButton 
            onPress={() => navigation.navigate('Channels')} 
            style={styles.categoryCard}
          >
            <Text style={styles.categoryTitle}>{item.category_name}</Text>
          </FocusableButton>
        )}
        keyExtractor={(item) => item.category_id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: { marginBottom: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 10, marginRight: 20, marginBottom: 10 },
    title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    seeAll: { color: '#1e90ff', fontSize: 16, fontWeight: 'bold' },
    categoryCard: { backgroundColor: '#282828', borderRadius: 8, padding: 20, marginHorizontal: 8, height: 100, width: 180, justifyContent: 'center', alignItems: 'center' },
    categoryTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
});

export default ContentChannelRow;
