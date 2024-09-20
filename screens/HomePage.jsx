import { StatusBar } from 'expo-status-bar';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../components/colors';
import { useState } from 'react';
import ActionButton from '../components/ActionButton';
import FormModal from '../components/FormModal';
import DataCard from '../components/DataCard';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from "react-native-vector-icons/Ionicons";

const HomePage = () => {

    const [pressed, setPressed] = useState(false);
    const [formModalVisible, setFormModalVisible] = useState(false);

    const [FormData, setFormData] = useState([]);

    // ! ----- Fonction pour enregistrer les données du formulaire ----- !
    const handleSubmit = (formData) => {
        setFormData([...FormData, formData]);
    }

    // ! ----- Fonction pour supprimer les données du formulaire ----- !
    handleDelete = (id) => {
        setFormData(FormData.filter((item) => item.id !== id));
    }

    // ! ----- Fonction pour calculer le nombre de poche de sang total enregistrés ----- !
    const totalPockets = FormData.reduce((sum, item) => {
        return sum + (parseInt(item.numberOfPocket) || 0)
        // - (parseInt(item.numberOfPocketRemoved) || 0) -
        // (parseInt(item.numberOfPocketDestroyed) || 0);
    }, 0);

    return (
        <SafeAreaProvider>
            <View style={styles.container}>
                <StatusBar style="light" />


                {/** Header de la page */}
                <View style={styles.Header} >
                    <Text style={styles.HeaderText}> 👋 Welcome to Blood Manager </Text>
                    <Text style={styles.HeaderSubText} >Recent Activity </Text>
                </View>

                {/** corps de la page */}
                {FormData.length <= 0 ?
                    <View style={styles.NoActivityBody} >
                        <Image source={require('../assets/No_activity.png')} style={{ width: 250, height: 250 }} />
                        <Text style={styles.NoActivityText} > You don't have any recent activity </Text>

                        <View style={styles.ActionButtonView} >
                            <ActionButton title="Add blood pocket" onPress={() => setFormModalVisible(true)} backgroundColor={colors.green} />
                        </View>


                    </View>

                    :
                    <View style={styles.ActivityBody} >

                        {/** Total des poches de sang */}
                        <View style={styles.TotalPocketView} >
                            <Text style={styles.TotalPocketText} >Total pockets : {totalPockets}</Text>
                        </View>

                        {/** Liste des ajouts récents */}
                        <FlatList
                            data={FormData}
                            renderItem={({ item }) => <DataCard data={item} onDelete={() => handleDelete(item.id)} />}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                        />

                        <View style={styles.ActivityActionButtonView} >
                            <ActionButton title="Add blood pockets" iconName="water-outline" onPress={() => setFormModalVisible(true)} backgroundColor={colors.green} />
                            <ActionButton title="Generate PDF report" iconName="download-outline" onPress={() => console.log('Generate PDF report of', FormData)} backgroundColor={colors.blue} />

                            <View style={{ flexDirection: 'row', alignItems: 'center', }} >
                                <Icon name="information-circle-outline" size={25} color={colors.primary} style={{ marginRight: 15 }} />
                                <Text>  Note: si vous fermez l'application, Toutes les données seront perdues ! </Text>
                            </View>
                        </View>
                    </View>
                }

                <FormModal visible={formModalVisible} onSubmit={handleSubmit} onClose={() => setFormModalVisible(false)} />
            </View>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F1F1F1",
    },
    Header: {
        height: 120,
        alignItems: 'center',
        backgroundColor: colors.primary,
        justifyContent: 'center',
        gap: 10,
        elevation: 3,
        shadowOpacity: 0.5,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 5 },
        paddingHorizontal: 10
    },
    HeaderText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.white,
    },
    HeaderSubText: {
        fontSize: 16,
        fontWeight: '400',
        color: colors.white,
    },
    NoActivityBody: {
        height: "80%",
        alignItems: 'center',
        justifyContent: 'center',
        gap: 30,
        flexDirection: 'column',
    },
    NoActivityText: {
        fontSize: 18,
        fontWeight: '500',
        color: colors.black
    },
    ActionButtonView: {
        marginTop: 20,
        width: "80%",
        alignItems: 'center',
    },
    ActivityActionButtonView: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 20,
        width: "100%",
        gap: 10,
    },
    ActivityBody: {
        padding: 10,
        height: "85%",
    },
    TotalPocketView: {
        flexDirection: 'row',
        position: 'absolute',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.green,
        zIndex: 10,
        width: 120,
        top: 5,
        right: "38%",
        borderRadius: 5,
        padding: 10,
        elevation: 3,
        shadowOpacity: 0.5,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 5 },
    },
    TotalPocketText: {
        fontWeight: '500',
        color: colors.white
    },

});

export default HomePage