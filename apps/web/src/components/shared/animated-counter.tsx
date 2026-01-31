"use client";

import { useEffect, useState } from "react";

export type AnimatedCounterProps = {
  target: number;
  text?: string;
  options?: {
    duration?: number;
    steps?: number;
    startValue?: number;
    endValue?: number;
  };
};
// set the default value for the options
const defaultOptions: AnimatedCounterProps["options"] = {
  duration: 2000,
  steps: 50,
  startValue: 0,
  endValue: 0,
};

export function AnimatedCounter(props: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isComplete) return;

    const duration =
      props?.options?.duration || (defaultOptions?.duration as number); // 2 seconds
    const steps = props?.options?.steps || (defaultOptions?.steps as number); // Reduced for better performance
    const increment = props.target / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setCount(props.target);
        setIsComplete(true);
        clearInterval(timer);
      } else {
        setCount(Math.floor(increment * currentStep));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [props.target, isComplete, props.options]);

  return (
    <>
      {count.toLocaleString()}
      {props.text ?? "k+"}
    </>
  );
}
