import React, { useState } from 'react';
import {
  HexGrade,
  Center,
  Stack,
  Grid,
  Inline,
  Button,
  Text,
  Heading,
} from '@securityscorecard/design-system';
import styled from 'styled-components';
// import { useSpring, animated } from 'react-spring';

import { mockData } from './mockData';

const data = mockData;

const DEGREE_NAMES = {
  1: '1st',
  2: '2nd',
  3: '3rd',
};

const GradeContainer = styled.div`
  padding: 1rem;
`;

const Connections = () => {
  const [proximity, setProximity] = useState(1);

  const sumValues = (obj) => Object.values(obj).reduce((a, b) => a + b);

  const connectionLevels = Object.keys(data);
  const allGrades = Object.keys(data['1']);
  const connectionTotals = Object.fromEntries(
    connectionLevels.map((level) => [level, sumValues(data[level])]),
  );

  const mapGradeSize = (value, inMin, inMax, outMin, outMax) =>
    ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

  // const gradeSizes = Object.fromEntries(
  //   connectionLevels.map((level) => [level, sumValues(data[level])]),
  // );

  return (
    <Center maxWidth={1000}>
      <Stack gap="md" justify="flex-start">
        <Inline gap="md">
          <Text size="sm">Proximity</Text>
          {connectionLevels.map((level) => {
            return (
              <Button
                size="lg"
                color="primary"
                variant="text"
                onClick={() => {
                  setProximity(level);
                }}
              >
                &nbsp;&nbsp;{DEGREE_NAMES[level]}&nbsp;&nbsp;
              </Button>
            );
          })}
        </Inline>

        <Center areChildrenCentered maxWidth={1000}>
          <Text size="sm">{DEGREE_NAMES[proximity]} Degree</Text>
          <Heading size="h0">{connectionTotals[proximity]}</Heading>

          <Grid align="center" gap="xl" cols={5}>
            {allGrades.map((grade) => {
              return (
                <Stack justify="center">
                  <GradeContainer>
                    <HexGrade
                      grade={grade}
                      variant="solid"
                      size={mapGradeSize(
                        data[proximity][grade],
                        Math.min(...Object.values(data[proximity])),
                        Math.max(...Object.values(data[proximity])),
                        32,
                        128,
                      )}
                    />
                  </GradeContainer>
                  <br />
                  <Text size="sm">{data[proximity][grade]}</Text>
                </Stack>
              );
            })}
          </Grid>
        </Center>
      </Stack>
    </Center>
  );
};

export default Connections;
