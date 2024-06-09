import { Text } from 'react-native';
import React from 'react';
import ReactTimeAgo from '../node_modules/react-timeago';
import ruStrings from '../node_modules/react-timeago/lib/language-strings/ru';
import buildFormatter from '../node_modules/react-timeago/lib/formatters/buildFormatter';

const formatter = buildFormatter(ruStrings);

export default function TimeAgo(props) {
    return <ReactTimeAgo {...props} formatter={formatter} component={Time}/>
}

function Time({ date, verboseDate, tooltip, children, style }) {
    return <Text style={style}>{children}</Text>
}