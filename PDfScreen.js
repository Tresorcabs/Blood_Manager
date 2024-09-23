import { Button, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { htmlConstent } from "./constantes/htmlContent";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const PDfScreen = () => {
  //!----------------definition de state----------------------------------------------------
  const [pdfUrl, setPdfUrl] = useState(null);
  // !---------------FONCTION--------------------------------
  const generatePDF = async () => {
    try {
      const { uri } = await Print.printToFileAsync({
        html: htmlConstent,
        base64: true,
        height: 842,
        width: 595,
      });
      setPdfUrl(uri);
      console.log("PDF genere avec succes:", pdfUrl);
    } catch (error) {
      console.error("Erreur lors de la generation du PDF:", error);
      Alert.alert("Erreur", "Erreur lors de la generation du PDF");
    }
  };
  const sharePDF = async () => {
    if (pdfUrl) {
      await Sharing.shareAsync(pdfUrl);
    }
  };
  return (
    <View>
      <Button title="Générer le PDF" onPress={generatePDF} />
      {pdfUrl && <Button title="Partager" onPress={sharePDF} />}
    </View>
  );
};

export default PDfScreen;

const styles = StyleSheet.create({});
