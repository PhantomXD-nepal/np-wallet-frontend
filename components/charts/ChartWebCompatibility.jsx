import React from 'react';
import { Platform } from 'react-native';
import { BarChart as GiftedBarChart, LineChart as GiftedLineChart, PieChart as GiftedPieChart } from 'react-native-gifted-charts';

/**
 * WebCompatibleBarChart - A wrapper for BarChart that handles web compatibility issues
 *
 * This component wraps the BarChart from react-native-gifted-charts and fixes event handler
 * warnings on web by conditionally applying web-specific props.
 */
export const BarChart = (props) => {
  // Remove problematic responder props on web platform
  const safeProps = Platform.OS === 'web'
    ? {
        ...props,
        // These props cause warnings on web so we set them to empty functions
        onStartShouldSetResponder: undefined,
        onResponderTerminationRequest: undefined,
        onResponderGrant: undefined,
        onResponderMove: undefined,
        onResponderRelease: undefined,
        onResponderTerminate: undefined,
        onPressOut: undefined,
        // Make sure topLabelComponent doesn't use any responder events on web
        topLabelComponent: props.topLabelComponent ?
          () => Platform.OS === 'web' ? null : props.topLabelComponent() : undefined,
        renderTooltip: Platform.OS === 'web' ? undefined : props.renderTooltip,
        // Avoid gradient on web as it often causes issues
        showGradient: Platform.OS === 'web' ? false : props.showGradient,
      }
    : props;

  return <GiftedBarChart {...safeProps} />;
};

/**
 * WebCompatibleLineChart - A wrapper for LineChart that handles web compatibility issues
 */
export const LineChart = (props) => {
  const safeProps = Platform.OS === 'web'
    ? {
        ...props,
        onStartShouldSetResponder: undefined,
        onResponderTerminationRequest: undefined,
        onResponderGrant: undefined,
        onResponderMove: undefined,
        onResponderRelease: undefined,
        onResponderTerminate: undefined,
        onPressOut: undefined,
        hideDataPoints: Platform.OS === 'web' ? true : props.hideDataPoints,
        areaChart: Platform.OS === 'web' ? false : props.areaChart,
        // Simplify chart on web to avoid issues
        curved: Platform.OS === 'web' ? false : props.curved,
      }
    : props;

  return <GiftedLineChart {...safeProps} />;
};

/**
 * WebCompatiblePieChart - A wrapper for PieChart that handles web compatibility issues
 */
export const PieChart = (props) => {
  const safeProps = Platform.OS === 'web'
    ? {
        ...props,
        onStartShouldSetResponder: undefined,
        onResponderTerminationRequest: undefined,
        onResponderGrant: undefined,
        onResponderMove: undefined,
        onResponderRelease: undefined,
        onResponderTerminate: undefined,
        onPressOut: undefined,
        // Simplify animations on web
        animate: Platform.OS === 'web' ? false : props.animate,
        showGradient: Platform.OS === 'web' ? false : props.showGradient,
        // Handle the center label differently on web
        centerLabelComponent: props.centerLabelComponent ?
          () => Platform.OS === 'web' ?
            props.centerLabelComponent().props.children.map((child, i) =>
              React.cloneElement(child, { key: i }))
            : props.centerLabelComponent()
          : undefined,
      }
    : props;

  return <GiftedPieChart {...safeProps} />;
};

/**
 * A utility to check if the platform is web and simplify props if needed
 * @param {Object} props - The component props
 * @returns {Object} - Safe props for web or the original props for native
 */
export const makeSafeForWeb = (props) => {
  if (Platform.OS !== 'web') return props;

  const { onStartShouldSetResponder, onResponderTerminationRequest,
          onResponderGrant, onResponderMove, onResponderRelease,
          onResponderTerminate, onPressOut, ...safeProps } = props;

  return safeProps;
};

export default {
  BarChart,
  LineChart,
  PieChart,
  makeSafeForWeb
};
