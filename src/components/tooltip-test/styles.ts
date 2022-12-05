import tw, { styled } from "twin.macro";
import { keyframes } from "styled-components";

export const ReferenceBox = styled.div`
  ${tw`flex flex-col justify-center items-center bg-white text-gray-900`}
  width: 10em;
  height: 6em;
  border-radius: 4px;
  z-index: 1;
  position: relative;
  a {
    color: #000000;
  }
`;

export const PopperBox = styled.div`
  ${tw`flex flex-col justify-center items-center text-white`}
  width: 6em;
  height: 6em;
  background-color: #232323;
  border-radius: 10px;
  padding: 0.5em;
  text-align: center;
`;

export const TransitionedPopperBox = styled(PopperBox)`
  transition: all 0.2s ease-out;
`;

export const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;
export const PoppersContainer = styled.div`
  opacity: 0;
  animation: ${fadeIn} 0.3s ease-in 0.5s forwards;
`;

export const pulse = keyframes`
  0%   { box-shadow: 0 0 0 rgba(0, 0, 0, .2); }
  50%  { box-shadow: 0 0 0 4px rgba(0, 0, 0, .2); }
  100% { box-shadow: 0 0 0 rgba(0, 0, 0, .2); }
`;

export const Arrow = styled.div`
  ${tw`absolute`}
  width: 3em;
  height: 3em;
  &[data-placement*="bottom"] {
    top: 0;
    left: 0;
    margin-top: -0.9em;
    &::before {
      border-width: 0 1.5em 1em 1.5em;
      border-color: transparent transparent #232323 transparent;
    }
  }
  &[data-placement*="top"] {
    bottom: 0;
    left: 0;
    margin-bottom: -2.9em;
    &::before {
      border-width: 1em 1.5em 0 1.5em;
      border-color: #232323 transparent transparent transparent;
    }
  }
  &[data-placement*="right"] {
    left: 0;
    margin-left: -1.9em;
    &::before {
      border-width: 1.5em 1em 1.5em 0;
      border-color: transparent #232323 transparent transparent;
    }
  }
  &[data-placement*="left"] {
    right: 0;
    margin-right: -1.9em;
    &::before {
      border-width: 1.5em 0 1.5em 1em;
      border-color: transparent transparent transparent #232323;
    }
  }
  &::before {
    content: "";
    margin: auto;
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
  }
`;
