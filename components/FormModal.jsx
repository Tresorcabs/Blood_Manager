import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { colors } from './colors'
import { TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { DatePickerInput, id } from 'react-native-paper-dates';
import RNPickerSelect from 'react-native-picker-select';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { registerTranslation, fr } from 'react-native-paper-dates';
import uuid from 'react-native-uuid';

const FormModal = ({ visible, onClose, onSubmit }) => {
    const [dataId, setDataId] = useState(0);

    const [formData, setFormData] = useState({
        id: dataId,
        numberOfPocket: 0,
        bloodType: '',
        RhesusFactor: 'Positif',  // + ou -
        expirationDate: undefined,
        numberOfPocketRemoved: 0,
        numberOfPocketDestroyed: 0,
        destructionJustification: 'aucune',
    });

    const [justificationDisabled, setJustificationDisabled] = useState(true);

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    // Enregistre la traduction française
    registerTranslation('fr', fr);

    const bloodTypeList = [
        { label: 'A', value: 'A' },
        { label: 'B', value: 'B' },
        { label: 'AB', value: 'AB' },
        { label: 'O', value: 'O' },
    ];

    const rhFactorList = [
        { label: 'Positif', value: 'positive' },
        { label: 'Négatif', value: 'negative' },
    ];

    const IncrementId = () => {
        const newId = dataId + 1; // Incrémenter l'identifiant
        setDataId(newId); // Mettre à jour l'identifiant courant

        // Logique pour ajouter un nouvel enregistrement
        console.log("Nouvel enregistrement avec ID : ", newId, " dataID", dataId);
    };

    const handleSubmit = () => {
        IncrementId();

        const formattedData = {
            ...formData,
            id: dataId,
            expirationDate: formData.expirationDate ? formData.expirationDate.toDateString() : undefined, // Conversion de la date en chaîne de caractères
        };

        onSubmit(formattedData);
        setFormData({
            id: dataId,
            numberOfPocket: 0,
            bloodType: '',
            RhesusFactor: 'Positif',
            expirationDate: undefined,
            numberOfPocketRemoved: 0,
            numberOfPocketDestroyed: 0,
            destructionJustification: 'aucune'
        });
        onClose();
    };


    return (
        <SafeAreaProvider>

            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequestClose={onClose}
            >
                <View
                    style={styles.formModal}
                >
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Blood Pockets Form </Text>

                        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
                            <View style={styles.pickerContainer}>
                                <RNPickerSelect
                                    onValueChange={(value) => handleChange('bloodType', value)}
                                    items={bloodTypeList}
                                    value={formData.bloodType}
                                    style={pickerSelectStyles}
                                    placeholder={{ label: "Sélectionnez le groupe sanguin", value: null }}
                                />
                            </View>

                            <View style={styles.pickerContainer}>
                                <RNPickerSelect
                                    onValueChange={(value) => handleChange('RhesusFactor', value)}
                                    items={rhFactorList}
                                    value={formData.RhesusFactor}
                                    style={pickerSelectStyles}
                                    placeholder={{ label: "Sélectionnez le facteur Rhesus", value: null }}
                                />
                            </View>

                            <TextInput
                                style={styles.input}
                                label="Nombre de poches"
                                value={formData.numberOfPocket}
                                onChangeText={(text) => handleChange('numberOfPocket', text)}

                                keyboardType='numeric'
                                theme={{ colors: { primary: colors.blue, background: colors.inputBg }, }}

                            />

                            <DatePickerInput
                                locale='fr'
                                label="Date d'expiration pour ces poches de sang"
                                value={formData.expirationDate}
                                onChange={(date) => handleChange('expirationDate', date)}
                                inputMode="start"
                                mode="single"
                                multiline={false}
                                style={styles.input}
                                validRange={{ start: new Date() }}
                                theme={{ colors: { primary: colors.blue, background: colors.white } }}
                            />

                            <TextInput
                                style={styles.input}
                                label="Nombre de poches Retirées"
                                value={formData.numberOfPocketRemoved}
                                onChangeText={(text) => handleChange('numberOfPocketRemoved', text)}

                                keyboardType='numeric'
                                theme={{ colors: { primary: colors.blue, background: colors.inputBg }, }}

                            />


                            <TextInput
                                style={styles.input}
                                label="Nombre de poches détruites"
                                value={formData.numberOfPocketDestroyed}
                                onChangeText={(text) => {
                                    handleChange('numberOfPocketDestroyed', text);

                                }}
                                keyboardType='numeric'
                                theme={{ colors: { primary: colors.blue, background: colors.inputBg }, }}

                            />

                            {formData.numberOfPocketDestroyed > 0 &&
                                <TextInput
                                    style={[styles.input, { height: 80, }]}
                                    label="Justification de la destruction"
                                    value={formData.destructionJustification}
                                    onChangeText={(text) => handleChange('destructionJustification', text)}
                                    theme={{ colors: { primary: colors.blue, background: colors.inputBg }, }}
                                    multiline={true}
                                />
                            }
                        </ScrollView>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Text style={styles.closeButtonText}>Fermer</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                <Text style={styles.buttonText}>Soumettre</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaProvider>
    )
}
const styles = StyleSheet.create({
    formModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '98%',
        height: '98%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    form: {
        width: '100%',
        marginTop: 20,

    },
    input: {
        width: '100%',
        height: 50,
        borderRadius: 5,
        marginBottom: 25,
        backgroundColor: colors.blueLight,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
    },
    button: {
        backgroundColor: colors.blue,
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    closeButton: {
        marginTop: 10,
    },
    closeButtonText: {
        color: colors.blue,
        fontWeight: '600',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    pickerContainer: {
        marginBottom: 20,
        width: '100%',
        borderBottomWidth: 1,
        borderColor: 'gray',
        height: 50,
    },

});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        marginBottom: 20,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
        backgroundColor: colors.blueLight,
    },
    inputAndroid: {
        fontSize: 16,
        marginBottom: 20,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: colors.blue,
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
        backgroundColor: colors.blueLight,
    },
});

export default FormModal