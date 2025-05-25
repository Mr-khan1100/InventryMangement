import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../styles/theme';
import menuIcon from '../assets/menuIcon.jpg'; // Your static menu icon
import placeholderImage from '../assets/placeholderImage.png';
const SharedCard = ({
    imageUrl,
    title,
    description,
    onCardPress,
    onEdit,
    onDelete,
}) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);

    return (
        <TouchableOpacity
        style={styles.card}
        activeOpacity={0.95}
        onPress={() => {
            if (dropdownVisible) setDropdownVisible(false);
            onCardPress && onCardPress();
        }}
        >
        {/* Menu Icon */}
        <TouchableOpacity
            style={styles.menuIcon}
            activeOpacity={0.8}
            onPress={() => setDropdownVisible(prev => !prev)}
        >
            <Image source={menuIcon} style={styles.menuImage} />
        </TouchableOpacity>

        <Image
            source={imageUrl ? { uri: imageUrl.uri } : placeholderImage}
            style={styles.image}
        />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{description}</Text>

        {/* Dropdown "Modal" below icon */}
        {dropdownVisible && (
            <View style={styles.dropdown}>
            <TouchableOpacity
                style={styles.option}
                activeOpacity={0.7}
                onPress={() => {
                setDropdownVisible(false);
                onEdit && onEdit();
                }}
            >
                <Text style={[styles.dropdownLabel, {color:COLORS.input}]}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.option}
                activeOpacity={0.7}
                onPress={() => {
                setDropdownVisible(false);
                onDelete && onDelete();
                }}
            >
                <Text style={[styles.dropdownLabel, {color:COLORS.red}]}>Delete</Text>
            </TouchableOpacity>
            </View>
        )}
        </TouchableOpacity>
    );
};

export default SharedCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.background,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        shadowColor: COLORS.shadow,
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        position: 'relative',
    },
    menuIcon: {
        position: 'absolute',
        top: 12,
        right: 15,
        zIndex: 3,
        padding: 4,
    },
    menuImage: {
        width: 22,
        height: 22,
        resizeMode: 'contain',
        tintColor: COLORS.gray,
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 6,
        marginBottom: 8,
        resizeMode: 'cover',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    desc: {
        fontSize: 14,
        color: COLORS.gray,
    },
    dropdown: {
        position: 'absolute',
        top: 40,
        right: 15,
        width: 120,
        backgroundColor: COLORS.background,
        borderRadius: 6,
        shadowColor: COLORS.black,
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
        zIndex: 2,
    },
    dropdownLabel: {
        fontSize: 14,
        // paddingVertical: 8,
        paddingHorizontal: 12,
    },
    option: {
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
});
