import { ThemedLayoutV2, ThemedSiderV2 } from "@refinedev/antd";
import { LogicalFilter, useCreate, useList, useRegister } from "@refinedev/core";
import { Button, Card, Col, Row, Steps } from "antd";
import { useParams } from "react-router-dom";
import { EXPERIMENT_PARTICIPATIONS, GROUP_COLLECTION } from "../../utility";
import { useCallback, useEffect, useState } from "react";
import Title from "antd/es/typography/Title";
import { IExperimentParticipation, IGroup } from "../../interfaces";

type RegisterVariables = {
    email: string;
    password: string;
};

export const StartExperiment: React.FC = () => {
    const { prolificId, experimentId } = useParams()

    const { mutate: create } = useCreate();
    const { mutate: register } = useRegister<RegisterVariables>();
    const { data: groupsData } = useList<IGroup>({ resource: GROUP_COLLECTION, filters: [{ field: 'experimentId', operator: 'eq', value: experimentId }] });
    const groups = groupsData?.data ?? []

    const filters: LogicalFilter[] = groups.map((g) => { return { field: 'groupId', operator: 'eq', value: g.id } })

    // todo: exclude participations with status 'dropped out'
    const { data: participationsData } = useList<IExperimentParticipation>({
        resource: EXPERIMENT_PARTICIPATIONS, pagination: { pageSize: 20000 }, filters: [
            {
                key: 'parent', operator: 'and', value: [
                    { field: 'experimentId', operator: 'eq', value: experimentId },
                    { operator: 'or', value: filters }
                ]
            }]
    });

    const participations = participationsData?.data ?? []
    console.log(participations)

    const [code, setCode] = useState(0);

    const generateRandomNumber = () => {
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        return randomNumber;
    };

    let runBefore = false

    const generateCode = () => {
        if (runBefore)
            return
        runBefore = true
        const code = generateRandomNumber()
        const fifteenMinutesFromNow = () => {
            const currentDate = new Date();
            const fifteenMinutesFromNow = new Date(currentDate.getTime() + 15 * 60000);
            return fifteenMinutesFromNow;
        };

        const date = fifteenMinutesFromNow();

        if (!prolificId || !experimentId)
            return
        const password = code.toString() + code.toString()
        // register({
        //     email: prolificId + '@prolific.com',
        //     password: password,
        // }, {
        //     onError: (data) => {
        //         console.log('ERROR', data);
        //     },
        //     onSuccess(data, variables, context) {



        const groupsWithAvailableSlots = []
        for (let i = 0; i < groups.length; i++) {
            const group = groups[i]
            const groupParticipations = participations.filter((p) => {
                return p.groupId == group.id
            })
            const isSpace = groupParticipations.length < group.numParticipants
            if (isSpace)
                groupsWithAvailableSlots.push(group)
        }

        const randomGroup = groupsWithAvailableSlots[Math.floor(Math.random() * groupsWithAvailableSlots.length)];
        if (!randomGroup) {
            console.log('ALL GROUPS ARE FULL')
            return
        }

        const selectedGroup = randomGroup.id

        create({
            resource: EXPERIMENT_PARTICIPATIONS,
            values: {
                prolificId: prolificId,
                code: code,
                expiryDate: date,
                experimentId: experimentId,
                groupId: selectedGroup,
                status: 'receivedCode'
            }
            //     });
            // },
        })

        setCode(generateRandomNumber())
    }

    // useEffect(() => {
    //     if (code == 0)
    //         generateCode();
    // }, [generateCode, code])

    if (!prolificId || !experimentId) {
        return <CustomLayout>Error</CustomLayout>
    }
    return code == 0
        ? (<CustomLayout>
            <Col span={24}>
                <Card title="Welcome">
                    <p>You are about to start the experiment.</p>
                    <Button onClick={() => generateCode()}>Generate App Code</Button>
                </Card>
            </Col>
        </CustomLayout>)
        : (<CustomLayout>
            <Col span={24}>
                <Card title="1. Get the FeedInsights App">
                    <p>Download the App <b>FeedInsights</b> to start the experiment.</p>
                    <p><img src="/images/download_app.png" /></p>
                </Card>
            </Col>
            <Col span={24}>

                <Card title="2. Enter code in FeedInsights App">
                    <Title level={2} copyable>{code}</Title>
                    <Button onClick={() => generateCode()}>Generate App Code</Button>

                    {/* <p>{prolificId} {experimentId}</p> */}
                    {/* <Button onClick={() => setCode(generateRandomNumber())}>Generate new code</Button> */}
                </Card>
            </Col>
        </CustomLayout>);
};

const CustomLayout = (props: { children: React.ReactNode }) =>
    <ThemedLayoutV2
        Sider={() => <></>}
        children={
            <Row justify="center" gutter={[24, 24]}>
                {props.children}
            </Row>
        }
    />



