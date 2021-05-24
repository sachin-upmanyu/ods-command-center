import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Heading,
} from '@chakra-ui/react';
import { usageTableColumns } from '../../utils/sandboxes';

function UsageTable({ usageData }) {
  return (
    <Box bg='white' border='1px solid' borderColor='gray.300'>
      <Box p='4'>
        <Heading size='lg'>Sandbox History</Heading>
      </Box>
      <Table my='1'>
        <Thead>
          <Tr>
            {usageTableColumns.map((c, i) => (
              <Th key={i}>{c}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {usageData.history && usageData.history.map((s, i) => (
            <Tr key={i}>
              <Td>{i + 1}</Td>
              <Td>
                {s.from && new Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                  hour: 'numeric',
                  minute: 'numeric',
                }).format(new Date(s.from))}
              </Td>
              <Td>
                {s.to && new Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                  hour: 'numeric',
                  minute: 'numeric',
                }).format(new Date(s.to))}
              </Td>
              <Td>{s.sandboxSeconds}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default UsageTable;
