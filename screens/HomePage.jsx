import { StatusBar } from 'expo-status-bar';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../components/colors';
import { useState } from 'react';
import ActionButton from '../components/ActionButton';
import FormModal from '../components/FormModal';
import DataCard from '../components/DataCard';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from "react-native-vector-icons/Ionicons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const HomePage = () => {
  //!-------------------------definition des states------------------------!

  const [pressed, setPressed] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);

  const [FormData, setFormData] = useState([]);

  const [pdfUrl, setPdfUrl] = useState(null);

  // ! ----- Fonction pour enregistrer les données du formulaire ----- !
  const handleSubmit = (formData) => {
    setFormData([...FormData, formData]);
  };

  // ! ----- Fonction pour supprimer les données du formulaire ----- !
  handleDelete = (id) => {
    setFormData(FormData.filter((item) => item.id !== id));
  };

  // ! ----- Fonction pour calculer le nombre de poche de sang total enregistrés ----- !
  const totalPockets = FormData.reduce((sum, item) => {
    return sum + (parseInt(item.numberOfPocket) || 0);
    // - (parseInt(item.numberOfPocketRemoved) || 0) -
    // (parseInt(item.numberOfPocketDestroyed) || 0);
  }, 0);
  // ! fonction pour determiner le nombre de poche d'un groupe sanguin avec le meme rhesus
  const groupSanguinRhésus = (data) => {
    return data.reduce((acc, personne) => {
      // cle de recherche une combinaisson du groupe sanguin et du rehesus
      const cle = `${personne.bloodType}${personne.RhesusFactor}`;
      // si cette combinaisson existe on l'incremente sinon on l'ajoute
      if (acc[cle]) {
        acc[cle]++;
      } else {
        acc[cle] = 1;
      }
      return acc;
    }, {});
  };

  const genrateHtml = () => {
    const row = groupSanguinRhésus(FormData);
    return `<tr><td>${row[0]}</td></tr>`;
  };

  const generatePDF = async () => {
    const resp = genrateHtml();
    const htmlConetnt = `<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    
</head>
<style>
        table {
            width: 100%;
            border-collapse: collapse;
        }
        table, th, td {
            border: 1px solid black;
        }
        th, td {
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        tr{
         border: 1px solid black;
        }
    </style>

<body>
    <!-- drfinition du header -->
     <div style="display:flex; justify-content:space-between ">
        <div >
            <p>MINISTERE DE LA SANTE PUBLIQUE</p>
            <P>DELEGATION REGIONALE DE L'OUEST</P>
            <P>HOPITAL REGIONAL DE BAFOUSSAM</P>
            <P>BP: 980 Bafoussam TEL: 233 44 15 11</P>
        </div>
        <div>
            <p>MINISTRY OF PUBLIC HEALTH</p>
            <P>WEST REGIONAL DELEGATION</P>
            <P>BAFOUSSAM REGIONAL HOSPITAL</P>
            <P>P.O Box: 980 Bafoussam TEL: 233 44 15 11</P>
        </div>
       
     </div>
      <div style="text-align: center;">
            <p style="font-size: larger; font-weight: bold;">UNITE DE LA BANQUE DE SANG ET TRANSFUSION SANGUINE</p>
        </div>
        <!-- definition du tableu -->
         <div style="width: 100%; justify-content: center ;">
            <table style="border-collapse: collapse; border: 2px solid rgb(140 140 140); width: 100%;">
                <thead>
                    <tr>
                        <th>Type de produits sanguins labiles</th>
                        <th>Groupe sanguin/Rhésus</th>
                        <th>Nombre de poches disponibles</th>
                        <th>Date de péremption</th>
                        <th>Quantité</th>
                        <th>Nombre de poches sorties</th>
                        <th>Nombre de poches détruites</th>
                    </tr>
                </thead>
                <!-- groupe sanguin -->
               ${resp}
                     
                 
            </table>
         </div>
    
</body>
</html>`;
    try {
      const { uri } = await Print.printAsync({
        html: htmlConetnt,
        height: 842,
        width: 595,
        base64: true,
      });
      setPdfUrl(uri);
      console.log("Pdf genere avec succes", pdfUrl);
    } catch (error) {
      console.error("Erreur lors de la generation du pdf", error);
    }
    const rest = groupSanguinRhésus(FormData);
    console.log(rest);
  };
  //! ----------------------fonction pour le partage -----------------------------------\
  const sharePDF = async () => {
    if (pdfUrl) {
      await Sharing.shareAsync(pdfUrl);
    }
  };
  // !generateur du html

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" />

        {/** Header de la page */}
        <View style={styles.Header}>
          <Text style={styles.HeaderText}> 👋 Welcome to Blood Manager </Text>
          <Text style={styles.HeaderSubText}>Recent Activity </Text>
        </View>

        {/** corps de la page */}
        {FormData.length <= 0 ? (
          <View style={styles.NoActivityBody}>
            <Image
              source={require("../assets/No_activity.png")}
              style={{ width: 250, height: 250 }}
            />
            <Text style={styles.NoActivityText}>
              {" "}
              You don't have any recent activity{" "}
            </Text>

            <View style={styles.ActionButtonView}>
              <ActionButton
                title="Add blood pocket"
                onPress={() => setFormModalVisible(true)}
                backgroundColor={colors.green}
              />
            </View>
          </View>
        ) : (
          <View style={styles.ActivityBody}>
            {/** Total des poches de sang */}
            <View style={styles.TotalPocketView}>
              <Text style={styles.TotalPocketText}>
                Total pockets : {totalPockets}
              </Text>
            </View>

            {/** Liste des ajouts récents */}
            <FlatList
              data={FormData}
              renderItem={({ item }) => (
                <DataCard data={item} onDelete={() => handleDelete(item.id)} />
              )}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />

            <View style={styles.ActivityActionButtonView}>
              <ActionButton
                title="Add blood pockets"
                iconName="water-outline"
                onPress={() => setFormModalVisible(true)}
                backgroundColor={colors.green}
              />
              <ActionButton
                title="Generate PDF report"
                iconName="download-outline"
                onPress={() => generatePDF()}
                backgroundColor={colors.blue}
              />
              {pdfUrl && (
                <ActionButton
                  title="Share PDF report"
                  // iconName="download-outline"
                  onPress={sharePDF}
                  backgroundColor={colors.green}
                />
              )}

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon
                  name="information-circle-outline"
                  size={25}
                  color={colors.primary}
                  style={{ marginRight: 15 }}
                />
                <Text>
                  {" "}
                  Note: si vous fermez l'application, Toutes les données seront
                  perdues !{" "}
                </Text>
              </View>
            </View>
          </View>
        )}

        <FormModal
          visible={formModalVisible}
          onSubmit={handleSubmit}
          onClose={() => setFormModalVisible(false)}
        />
      </View>
    </SafeAreaProvider>
  );
};

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