import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import ActionButton from './ActionButton'
import Icon from "react-native-vector-icons/Ionicons";
import { colors } from './colors';

const DataCard = ({ data, onDelete }) => {
    return (
        <View style={styles.card}>
            {/* <Icon name="information-circle" size={25} color={colors.green} style={{ marginRight: 15 }} /> */}
            <Text style={styles.cardTitle}>Ajout N° {data.id}</Text>
            <Text style={styles.cardText}>Type de sang : <Text style={styles.cardValue} >{data.bloodType}</Text></Text>
            <Text style={styles.cardText}>Rhesus : <Text style={styles.cardValue} >{data.RhesusFactor}</Text></Text>
            <Text style={styles.cardText}>Date d'expiration des ({data.numberOfPocket}) poches: <Text style={styles.cardValue} >{data.expirationDate}</Text></Text>
            <Text style={styles.cardText}>Nombre de poches Reçues : <Text style={styles.cardValue} >{data.numberOfPocket}</Text></Text>
            <Text style={styles.cardText}>Nombre de poches retirees : <Text style={styles.cardValue} >{data.numberOfPocketRemoved}</Text></Text>
            <Text style={styles.cardText}>Nombre de poches détruites : <Text style={styles.cardValue} >{data.numberOfPocketDestroyed}</Text></Text>
            <Text style={styles.cardText}>Justification de destruction : <Text style={styles.cardValue} >{data.destructionJustification}</Text></Text>

            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
                <Icon name="trash" size={20} color="#FF3B30" />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        marginHorizontal: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        padding: 5,
    },
    deleteButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        padding: 10,
        borderRadius: 100,
        width: 40,
        alignItems: 'center',
        position: 'absolute',
        right: 10,
        top: 80
    },
    cardText: {
        marginBottom: 5,
        fontWeight: '600',
    },
    cardValue: {
        fontWeight: '300',
        fontStyle: 'italic',
    }
})
export default DataCard