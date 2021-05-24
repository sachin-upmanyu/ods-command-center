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
import { operationsTableColumns } from '../../utils/sandboxes';

function OperationsTable({ operationsData }) {
  return (
    <Box bg='white' border='1px solid' borderColor='gray.300'>
      <Box p='4'>
        <Heading size='lg'>Sandbox History</Heading>
      </Box>
      <Table my='1'>
        <Thead>
          <Tr>
            {operationsTableColumns.map((c, i) => (
              <Th key={i}>{c}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {operationsData.map((s, i) => (
            <Tr key={i}>
              <Td>{i + 1}</Td>
              <Td>{s.id}</Td>
              <Td>
                {new Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                  hour: 'numeric',
                  minute: 'numeric',
                }).format(new Date(s.createdAt))}
              </Td>
              <Td>{s.operationState}</Td>
              <Td>{s.status}</Td>
              <Td>{s.operation}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default OperationsTable;
