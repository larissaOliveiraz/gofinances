import { TouchableOpacity } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";

export const Container = styled(TouchableOpacity)`
  width: 100%;
  padding: 18px 36px;

  border-radius: 5px;

  background-color: ${({ theme }) => theme.colors.secondary};
  align-items: center;
`;

export const Title = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: ${({ theme }) => theme.fonts.medium};
  color: ${({ theme }) => theme.colors.shape};
`;
