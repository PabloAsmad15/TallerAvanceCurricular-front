import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Text, VStack, Icon } from '@chakra-ui/react';
import { FiUploadCloud } from 'react-icons/fi';

const FileUploader = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/xml': ['.xml'],
    },
    maxFiles: 1,
  });

  return (
    <Box
      {...getRootProps()}
      w="100%"
      p={8}
      borderWidth={2}
      borderRadius="xl"
      borderStyle="dashed"
      borderColor={isDragActive ? 'brand.500' : 'gray.300'}
      bg={isDragActive ? 'brand.50' : 'white'}
      cursor="pointer"
      transition="all 0.2s ease-in-out"
      boxShadow={isDragActive ? 'md' : 'sm'}
      _hover={{
        borderColor: 'brand.500',
        bg: 'brand.50',
        transform: 'translateY(-1px)',
      }}
    >
      <input {...getInputProps()} />
      <VStack spacing={3}>
        <Icon as={FiUploadCloud} w={10} h={10} color={isDragActive ? 'brand.500' : 'brand.400'} />
        <Text textAlign="center" fontWeight="600" color={isDragActive ? 'brand.700' : 'gray.700'}>
          {isDragActive
            ? 'Suelta el archivo aquí...'
            : 'Arrastra y suelta tu reporte aquí, o haz clic para seleccionar'}
        </Text>
        <Text fontSize="xs" color="gray.500">
          Archivos permitidos: PDF o XML
        </Text>
      </VStack>
    </Box>
  );
};

export default FileUploader;