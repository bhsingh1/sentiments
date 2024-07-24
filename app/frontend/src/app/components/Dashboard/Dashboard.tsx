import React from 'react';
import { Card, Flex, FlexItem, FormSelect, FormSelectOption, Label, Page, PageSection, Text, TextContent, TextInput, TextVariants } from '@patternfly/react-core';

const Dashboard = () => {
    return (
        <Page>
            <PageSection>
                <TextContent>
                    <Text component={TextVariants.h1}>Dashboard</Text>
                </TextContent>
            </PageSection>
            <PageSection>
                <TextContent>
                    <Text component={TextVariants.h3}>Use OpenShift AI for Feedback Mining and many other use-cases.</Text>
                </TextContent>
            </PageSection>
            <PageSection>
                <img src={require('../../assets/bgimages/rhai.png').default}/>
            </PageSection>
        </Page>
    );
};

export { Dashboard };
