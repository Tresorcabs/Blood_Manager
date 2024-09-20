import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "./colors";
import Icon from "react-native-vector-icons/Ionicons";


const ActionButton = ({ title, onPress, backgroundColor, iconName, width, radius, padding }) => {

    const [pressed, setPressed] = useState(false);
    return (
        <Pressable
            style={[
                {
                    backgroundColor: backgroundColor,
                    width: width ? width : "80%",
                    borderRadius: radius ? radius : 10,
                    padding: padding ? padding : 15,

                },
                styles.ActionButton,
                pressed && styles.pressed
            ]}
            onPress={onPress}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10
                }}
            >

                {
                    iconName &&
                    <Icon
                        name={iconName}
                        size={20}
                        color={colors.white}
                        style={{ alignSelf: 'center' }}
                    />
                }

                <Text style={styles.ActionButtonText} > {title && title} </Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    ActionButton: {
        alignItems: 'center',
    },
    ActionButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.white,
    },
    pressed: {
        opacity: 0.5
    }
})

export default ActionButton
