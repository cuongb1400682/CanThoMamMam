import React from "react";
import {View, StyleSheet, FlatList, Text, Picker} from "react-native";
import {FormLabel, CheckBox} from "react-native-elements";
import {getWeekdayName} from "../../../utils/DateTimeUtils";


export default class ScheduleInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      scheduleListData: [
        {key: 0, isWorkday: true, openHour: 25200, workingTime: 28800, }, /* Monday, 7AM, work for 8 hours */
        {key: 1, isWorkday: true, openHour: 25200, workingTime: 28800, }, /* Tuesday, 7AM, work for 8 hours */
        {key: 2, isWorkday: true, openHour: 25200, workingTime: 28800, }, /* Wednesday, 7AM, work for 8 hours */
        {key: 3, isWorkday: true, openHour: 25200, workingTime: 28800, }, /* Thursday, 7AM, work for 8 hours */
        {key: 4, isWorkday: true, openHour: 25200, workingTime: 28800, }, /* Friday, 7AM, work for 8 hours */
        {key: 5, isWorkday: true, openHour: 25200, workingTime: 28800, }, /* Saturday, 7AM, work for 8 hours */
        {key: 6, isWorkday: false, openHour: 25200, workingTime: 28800, }, /* Sunday, weekend */
      ],
    };
  }

  renderListItem({item, index}) {
    return (
      <View style={[{backgroundColor: !(index % 2) ? "#eaeaea" : "white"}, styles.row]}>
        <CheckButton/>
        <Text>{getWeekdayName(index)}</Text>
      </View>
    )
  }

  render() {
    return (
      <View>
        <FormLabel>{"SCHEDULE"}</FormLabel>
        <FlatList
          data={this.state.scheduleListData}
          renderItem={this.renderListItem.bind(this)}
          style={[styles.viewIndentation]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewIndentation: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 15,
    marginBottom: 1,
    borderColor: "#dddddd",
    borderWidth: 1,
  },
  row: {
    height: 24,
    justifyContent: "center",
    flexDirection: "row",
    paddingLeft: 4,
  },
});
