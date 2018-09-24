/********* https://snack.expo.io/@amcvitty/flatlist-scroll-bug */
import React from "react";
import { View, Text, StyleSheet, Button, FlatList } from "react-native";

const SCROLL_VIEW_LEFT_INSET = 10;
const SCROLL_VIEW_RIGHT_INSET = 40;

let scrollView;
const ScrollControl = () => {
  const components = ["A", "B", "C", "D1", "D2", "E", "X1", "X2", "X3"];
  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 100 }}>
        <FlatList
          horizontal
          initialNumToRender={components.length}
          contentInset={{
            left: SCROLL_VIEW_LEFT_INSET,
            right: SCROLL_VIEW_RIGHT_INSET,
            top: 0,
            bottom: 0,
          }}
          contentOffset={{ x: -SCROLL_VIEW_LEFT_INSET, y: 0 }}
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
          ref={x => (scrollView = x)}
          data={components.map(label => ({ label, key: label }))}
          renderItem={({ item, index }) => (
            <View style={styles.button}>
              <Text style={styles.buttonText}>{item.label}</Text>
            </View>
          )}
        />
      </View>

      <View style={{ flex: 1 }}>
        {components.map((label, i) => (
          <Button
            title={label}
            key={label}
            onPress={() => {
              
              scrollView.scrollToIndex({
                index: i,
                viewOffset: SCROLL_VIEW_LEFT_INSET,
                viewPosition: 0.5
              });
            }}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    marginTop: 30,
    paddingBottom: 15,
    flex: 1,
  },
  button: {
    marginRight: 10,
    backgroundColor: "red",
    borderRadius: 10,
    height: 60,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 30,
    fontWeight: "700",
    color: "white",
  },
});

export default ScrollControl;