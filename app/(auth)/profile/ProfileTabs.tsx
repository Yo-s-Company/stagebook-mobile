import { TabType, ThemeColors } from '@/src/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: TabType) => void;
  theme: ThemeColors;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, setActiveTab, theme }) => {
  // Mapeo para nombres e iconos
  const tabConfig: { id: TabType; label: string; icon: any }[] = [
    { id: 'book', label: 'Book', icon: 'grid' },
    { id: 'obras', label: 'Obras', icon: 'movie-outline' },
    { id: 'proyectos', label: 'Proyectos', icon: 'folder-outline' },
  ];

  return (
    <View style={[styles.tabBar, { borderBottomColor: theme.primary + '10' }]}>
      <View style={styles.tabsInnerContainer}>
        {tabConfig.map((tab) => {
          const isActive = activeTab === tab.id;
          const activeColor = isActive ? theme.primary : "#71717a";

          return (
            <TouchableOpacity 
              key={tab.id} 
              onPress={() => setActiveTab(tab.id)}
              style={[
                styles.tab, 
                isActive && { borderBottomColor: theme.primary, borderBottomWidth: 3 }
              ]}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons 
                name={tab.icon} 
                size={20} 
                color={activeColor} 
              />
              <Text style={[styles.tabLabel, { color: activeColor }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: { 
    width: '100%',
    justifyContent: 'space-around', 
    flexDirection: 'row', 
  },
  tabsInnerContainer: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    width: '90%', 
    gap: 10,
  },
  tab: { 
    flex: 1, 
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 100, 
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 4,
    letterSpacing: 0.5
  }
});

export default ProfileTabs;