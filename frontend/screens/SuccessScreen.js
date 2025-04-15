import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { theme } from '../theme';

const SuccessScreen = ({ navigation }) => {
    const handleContinue = () => {
        navigation.navigate('Main');
    };

    return (
        <View style={styles.container}>
            {/* Light green circle in the top left */}
            <View style={styles.circleTop} />

            {/* Light green circle in the bottom right */}
            <View style={styles.circleBottom} />

            {/* Checkmark Icon */}
            <Ionicons name="checkmark-circle" size={100} color={theme.colors.primary} style={styles.icon} />

            {/* Title */}
            <Text style={styles.title}>Success!!</Text>

            {/* Subtitle */}
            <Text style={styles.subtitle}>You have successfully set a new password</Text>

            {/* Continue Button */}
            <TouchableOpacity style={styles.button} onPress={handleContinue}>
                <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
        paddingHorizontal: theme.spacing.large,
        paddingTop: theme.spacing.extraLarge,
        paddingBottom: theme.spacing.extraLarge,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleTop: {
        position: 'absolute',
        top: -100,
        left: -100,
        width: 300,
        height: 300,
        backgroundColor: '#E8F5E9', // Light green color
        borderRadius: 150,
    },
    circleBottom: {
        position: 'absolute',
        bottom: -100,
        right: -100,
        width: 300,
        height: 300,
        backgroundColor: '#E8F5E9', // Light green color
        borderRadius: 150,
    },
    icon: {
        marginBottom: theme.spacing.large,
    },
    title: {
        fontSize: theme.fontSizes.extraLarge,
        fontWeight: 'bold',
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: theme.spacing.small,
    },
    subtitle: {
        fontSize: theme.fontSizes.medium,
        color: theme.colors.textLight,
        textAlign: 'center',
        marginBottom: theme.spacing.large,
    },
    button: {
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.medium,
        borderRadius: 25,
        alignItems: 'center',
        width: '80%',
    },
    buttonText: {
        color: theme.colors.white,
        fontSize: theme.fontSizes.medium,
        fontWeight: 'bold',
    },
});

export default SuccessScreen;   