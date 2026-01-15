import React from 'react';
import { Button, HStack, Text, IconButton, Select, Flex } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";

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
                        <Select
                            size="xs"
                            width="70px"
                            value={itemsPerPage}
                            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </Select>
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
