import React from "react";
import {Resource} from "src/server";
import {Box, Flex, Grid} from "@chakra-ui/react";
import {H2, RounderBox} from "./primitives";
import ResourceCard from "./resourceCard";

interface Props {
    resource: Resource;
}

const ResourcePanel: React.FC<Props> = ({
    resource
}) => {

    return (
        <Box>
            <H2
                fontSize={16}
                mb="15px"
                id={resource.name}
            >
                {resource.name}
            </H2>
            <Grid
                rowGap="15px"
                columnGap="15px"
                gridTemplateColumns={["repeat(1, 1fr)", "repeat(1, 1fr)", "repeat(3, 1fr)", "repeat(4, 1fr)", "repeat(5, 1fr)"]}
            >
                {
                    resource.site.map((site) => (<ResourceCard key={site.name} site={site} />))
                }
            </Grid>
        </Box>
    );
};

export default ResourcePanel;
