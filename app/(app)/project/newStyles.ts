import { Platform, StyleSheet } from "react-native";

export const getStyles = (isDark: boolean, dynamicBg: string, dynamicText: string, borderCol: string, cardBg: string, secondaryText: string) => StyleSheet.create({
    mainContainer: { 
        flex: 1 
    },
    headerContainer: { 
        alignItems: 'center', 
        marginBottom: 40, 
        justifyContent: 'center' 
    },
    scrollContainer: { 
        paddingHorizontal: 25, 
        paddingBottom: 40 
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: -1,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    inputSection: { 
        marginBottom: 25 
    },
    mainInput: {
        fontSize: 26,
        fontWeight: 'bold',
        borderBottomWidth: 2,
        paddingVertical: 5,
    },
    inputSub: { 
        fontSize: 11,
        marginTop: 5 
    },
    uploadBtn: {
        flexDirection: 'row',
        backgroundColor: '#00BFFF',
        alignSelf: 'flex-start',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignItems: 'center',
        gap: 8,
        marginBottom: 30,
    },
    uploadBtnText: { 
        color: '#fff', 
        fontWeight: 'bold', 
        fontSize: 14
    },
    section: { 
        marginBottom: 25 
    },
    sectionLabel: { 
        fontSize: 13, 
        fontWeight: 'bold', 
        marginBottom: 8 
    },
    textArea: {
        borderRadius: 12,
        padding: 15,
        minHeight: 120,
        fontSize: 14,
        borderWidth: 1,
    },
    addMemberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 30,
    },
    addMemberText: { 
        fontSize: 14, 
        fontWeight: 'bold' 
    },
    row: { 
        flexDirection: 'row', 
        gap: 15, 
        marginBottom: 30 },
    dateCol: { 
        flex: 1 
    },
    dateInputContainer: {
        flexDirection: 'row',
        padding: 12,
        borderRadius: 8,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
    },
    colorRow: { 
        flexDirection: 'row',
        gap: 10, 
        marginTop: 10, 
        padding: 10, 
        borderRadius: 12, 
        alignSelf: 'flex-start', 
        borderWidth: 1 
    },
    colorCircle: { 
        width: 18, 
        height: 18, 
        borderRadius: 4 
    },
    buttonContainer: {
        marginTop: 20, 
        gap: 12 
    },
    primaryBtn: {
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    primaryBtnText: { 
        fontWeight: 'bold', 
        fontSize: 14 
    },
    secondaryBtn: {
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    secondaryBtnText: { 
        fontWeight: 'bold', 
        fontSize: 14 
    },
    accordionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
    },
    accordionContent: {
        paddingVertical: 20,
        gap: 15,
    },
    charCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 10,
    }
});

export default getStyles;