import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import React from 'react'
import { Ionicons } from "@expo/vector-icons";

function Menu() {
    return (
        <View style={{ position: 'absolute', height: '100%', width: '100%' }}>

            <TouchableOpacity style={{ position: 'absolute', height: '100%', width: '100%', backgroundColor: 'red' }} >
            </TouchableOpacity>
            <View style={{ backgroundColor: 'gray', width: '70%', height: '100%' }}>
                <View>
                    <Text>MENU</Text>
                </View>
                <Link href={'/(screens)'}>
                    <TouchableOpacity>
                        <Ionicons />
                        <Text>Todos</Text>
                    </TouchableOpacity>
                </Link>
                <Link href={'/(screens)/Archive'}>
                    <TouchableOpacity>
                        <Ionicons />
                        <Text>Archives</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    )
}

export default Menu