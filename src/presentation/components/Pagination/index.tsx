import React, { useMemo } from 'react';
import { Button, HStack, Text, IconButton, Flex, Box } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import SearchableSelect from "../SearchableSelect";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    itemsPerPage?: number;
    onItemsPerPageChange?: (size: number) => void;
    totalItems: number;
}

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    onItemsPerPageChange,
    totalItems
}: PaginationProps) => {

    const pageSizeOptions = useMemo(() => [
        { value: '10', label: '10' },
        { value: '20', label: '20' },
        { value: '50', label: '50' },
        { value: '100', label: '100' },
    ], []);

    // Safety check
    if (totalPages <= 1) return null;

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            onPageChange(newPage);
        }
    };

    return (
        <Flex justifyContent="space-between" alignItems="center" mt={4} p={2} borderTop="1px solid" borderColor="gray.100">
            <HStack spacing={4}>
                <Text fontSize="sm" color="gray.600">
                    Total: <b>{totalItems}</b> items
                </Text>

                {itemsPerPage && onItemsPerPageChange && (
                    <HStack>
                        <Text fontSize="sm" color="gray.600">Show:</Text>
                        <Box w="80px">
                            <SearchableSelect
                                size="sm"
                                options={pageSizeOptions}
                                value={itemsPerPage.toString()}
                                onChange={(val) => onItemsPerPageChange(Number(val))}
                                placeholder=""
                            />
                        </Box>
                    </HStack>
                )}
            </HStack>

            <HStack>
                <IconButton
                    aria-label="First Page"
                    icon={<ArrowLeftIcon />}
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    isDisabled={currentPage === 1}
                />
                <IconButton
                    aria-label="Previous Page"
                    icon={<ChevronLeftIcon />}
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    isDisabled={currentPage === 1}
                />

                <Text fontSize="sm" fontWeight="bold">
                    {currentPage} / {totalPages}
                </Text>

                <IconButton
                    aria-label="Next Page"
                    icon={<ChevronRightIcon />}
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    isDisabled={currentPage === totalPages}
                />
                <IconButton
                    aria-label="Last Page"
                    icon={<ArrowRightIcon />}
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                    isDisabled={currentPage === totalPages}
                />
            </HStack>
        </Flex>
    );
};

export default Pagination;
