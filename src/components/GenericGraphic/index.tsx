import { Box, Flex } from "@chakra-ui/react";
import { VerticalBar } from "../Charts/ChartVerticalBar";

interface GebericGraphicProps {
  title: string;
  label: string;
  labels: string[];
  data: any[]
}

export function GenericGraphic({ title, label, labels, data }: GebericGraphicProps) {
  return (
    <>
      <Flex justifyContent="center">
        <Box
          p={["4", "5"]}
          bg="Snow"
          borderRadius={8}
          pb="4"
          mb="4"
          mt="4"
          maxWidth="1020px"
          minWidth="920px"
        >
          <VerticalBar
            title={title}
            labels={labels}
            data={data}
            label={label}
          />
        </Box>
      </Flex>
    </>
  );
}
