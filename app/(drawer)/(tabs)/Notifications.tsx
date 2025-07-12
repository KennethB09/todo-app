import { View, Text } from 'react-native'
import React from 'react'
import { useTodoListData } from '@/context/todoListContext'

const Notifications = () => {

  const { userData } = useTodoListData();
  const notifications = userData?.notifications || [];
  return (
    <View>
      <Text>Notifications</Text>
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <View key={index}>
            <Text>{notification.title}</Text>
            <Text>{notification.content}</Text>
            <Text>{new Date(notification.timestamp).toLocaleString()}</Text>
          </View>
        ))
      ) : (
        <Text>No notifications</Text>
      )}
    </View>
  )
}

export default Notifications