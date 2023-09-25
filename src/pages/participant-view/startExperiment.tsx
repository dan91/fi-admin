import { ThemedLayoutV2 } from "@refinedev/antd";
import { LogicalFilter, useCreate, useList, useRegister } from "@refinedev/core";
import { Button, Card, Col, Result, Row } from "antd";
import { useParams } from "react-router-dom";
import { EXPERIMENT_PARTICIPATIONS, GROUP_COLLECTION } from "../../utility";
import { ReactNode, useState } from "react";
import Title from "antd/es/typography/Title";
import { IExperimentParticipation, IGroup } from "../../interfaces";
import { ParticipationStatus } from "../../interfaces/enums";

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

    const [code, setCode] = useState(0);
    const [error, setError] = useState<ReactNode | null>(null)

    const generateRandomNumber = () => {
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        return randomNumber;
    };

    const getGroupsWithAvailableSlots = (): IGroup[] => {
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
        return groupsWithAvailableSlots
    }

    const errorResult = <Result
        title="No more free seats in this experiment"
        extra={
            <Button type="primary" onClick={() => generateCode()}>
                Try again
            </Button>
        }
    />

    const generateCode = (): void => {
        const newCode = generateRandomNumber()
        const date = fifteenMinutesFromNow();
        const password = newCode.toString() + newCode.toString()
        // todo: check if user already exists -> if yes, just show the existing code, and reset the expiryDate
        register({
            email: prolificId + '@prolific.com',
            password: password,
        }, {
            onSuccess(data) {
                const groupsWithAvailableSlots = getGroupsWithAvailableSlots()
                const randomGroup = groupsWithAvailableSlots[Math.floor(Math.random() * groupsWithAvailableSlots.length)];

                if (!randomGroup) {
                    setError(errorResult)
                }

                create({
                    resource: EXPERIMENT_PARTICIPATIONS,
                    values: {
                        prolificId: prolificId,
                        code: newCode,
                        expiryDate: date,
                        experimentId: experimentId,
                        groupId: randomGroup.id,
                        status: ParticipationStatus.receivedCode
                    }
                });
            },
        })
        setCode(newCode)

    }

    if (!prolificId || !experimentId) {
        return <CustomLayout>Error</CustomLayout>
    }
    return code == 0
        ? (<CustomLayout>
            <Col xs={24} lg={8} xl={6}>
                <Card title="Welcome">
                    <p>You are about to start the experiment.</p>
                    <Button onClick={() => generateCode()}>Generate App Code</Button>
                    {error}
                </Card>
            </Col>
        </CustomLayout >)
        : (<CustomLayout>
            <Col xs={24} lg={13}>
                <Card title="1. Get the FeedInsights App">
                    <p>Download the App <b>FeedInsights</b> to start the experiment.</p>
                    <p><img src="/images/download_app.png" /></p>
                </Card>
            </Col>
            <Col xs={24} lg={13}>

                <Card title="2. Enter code in FeedInsights App">
                    <Title level={2} copyable>{code}</Title>

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

const fifteenMinutesFromNow = () => {
    const currentDate = new Date();
    const fifteenMinutesFromNow = new Date(currentDate.getTime() + 15 * 60000);
    return fifteenMinutesFromNow;
};

