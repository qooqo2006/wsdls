/* eslint-disable @next/next/no-img-element */
import React, {useState, useRef, useEffect, useContext, useLayoutEffect} from "react";
import {Checkbox, Text, Box} from "@chakra-ui/react";
import {ResourceItem} from "src/server";
import {RounderBox, H3} from "./primitives";
import {getDb, myCollectionTableName} from "src/util/indexDB";
import {MyCollectionContext} from "src/components/content";

interface Props {
    site: ResourceItem;
    hasCollectBtn: boolean;
}

const ResourceCard: React.FC<Props> = ({
    site,
    hasCollectBtn
}) => {
    const linkRef = useRef<HTMLAnchorElement>(null);
    const [checked, setChecked] = useState<boolean>(false);
    const {setMyCollection} = useContext(MyCollectionContext);

    useEffect(() => {
        getDb().then((db) => {
            db.read(myCollectionTableName, site.name).then((res) => {
                if (res) {
                    setChecked(true);
                } else {
                    setChecked(false);
                }
            });
        });
    }, []);

    const clickHandle = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const linkEle = linkRef.current;
        if (linkEle && event.target !== linkEle) {
            linkEle.click();
        };
    };

    const checkBoxChange = () => {
        getDb().then((db) => {
            if (!checked) {
                db.write(myCollectionTableName, site).then((res) => {
                    if (res) {
                        console.log("添加成功");
                        setChecked(true);
                        setMyCollection((collection) => ([...collection, site]));
                    } else {
                        console.log("添加失败");
                    }
                });
            } else {
                db.remove(myCollectionTableName, site.name).then((res) => {
                    if (res) {
                        console.log("删除成功");
                        setChecked(false);
                        setMyCollection((collection) => {
                            const index = collection.findIndex((item) => item.name === site.name);
                            if (index !== -1) {
                                const newCollection = [...collection];
                                newCollection.splice(index, 1);
                                return newCollection;
                            }
                            return collection;
                        });
                    } else {
                        console.log("删除失败");
                    }
                })
            }
        });
    };

    return (
        <RounderBox
            display="flex"
            p="15px"
            columnGap="15px"
            _hover={{
                transform: "scale(0.95)",
                bgColor: "#ebedec"
            }}
            transition="all 1s"
            cursor="pointer"
            onClick={clickHandle}
            pos="relative"
        >
            {
                site.image ? (
                    <Box flexShrink={0} w="60px">
                        <img
                            src={site.image}
                            alt={site.name}
                            width={50}
                            height={50}
                        />
                    </Box>
                ) : <></>
            }
            <Box>
                <H3 fontSize="16px">
                    <a
                        ref={linkRef}
                        href={site.url}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {site.name}
                    </a>
                </H3>
                <Text mt="14px" fontSize="14px" color="gray.400">{site.description}</Text>
            </Box>
            {
                hasCollectBtn ? (
                    <Box
                        pos="absolute"
                        right="10px"
                        top="10px"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <Checkbox
                            isChecked={checked}
                            onChange={checkBoxChange}
                        />
                    </Box>
                ) : <></>
            }
        </RounderBox>
    );
};

export default ResourceCard;
