import { ThemedLayoutV2 } from "@refinedev/antd";
import { LogicalFilter, useCreate, useList, useOne, useRegister, useUpdate } from "@refinedev/core";
import { Button, Card, Col, Result, Row, Spin } from "antd";
import { useParams } from "react-router-dom";
import { EXPERIMENT_COLLECTION, EXPERIMENT_PARTICIPATIONS, GROUP_COLLECTION } from "../../utility";
import { ReactNode, useState } from "react";
import Title from "antd/es/typography/Title";
import { IExperiment, IExperimentParticipation, IGroup } from "../../interfaces";
import { ParticipationStatus } from "../../interfaces/enums";
import { unescape } from "querystring";

type RegisterVariables = {
    email: string;
    password: string;
};

export const StartExperiment: React.FC = () => {
    const { prolificId, experimentId } = useParams()

    const { mutate: create } = useCreate();
    const { mutate: update } = useUpdate<IExperimentParticipation>();
    const { mutate: register } = useRegister<RegisterVariables>();
    const { isError, isLoading } = useOne<IExperiment>({ resource: EXPERIMENT_COLLECTION, id: experimentId, errorNotification: false });
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
    const currentParticipation = participations.find((p) => p.prolificId == prolificId)

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
        if (currentParticipation?.id) {
            update({ resource: EXPERIMENT_PARTICIPATIONS, id: currentParticipation.id, values: { expiryDate: date }, successNotification: false })
            setCode(currentParticipation.code)
            return;
        }
        register({
            email: prolificId + '@prolific.com',
            password: password,
        }, {
            onSuccess(data) {

                const groupsWithAvailableSlots = getGroupsWithAvailableSlots()
                const randomGroup = groupsWithAvailableSlots[Math.floor(Math.random() * groupsWithAvailableSlots.length)];

                // todo: this error handling does not work anymore
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
                    },
                    successNotification: false
                });
            },
        })
        setCode(newCode)

    }

    if (!prolificId || !experimentId) {
        return <CustomLayout>You got here via an invalid link. Please contact the experiment conductor.</CustomLayout>
    }
    return code == 0
        ? (<CustomLayout>
            {isLoading ? <Spin /> :
                <Col xs={24} lg={8} xl={6}>
                    <Card title="Welcome">
                        {!isError ? <>
                            <p>You are about to start the experiment.</p>
                            <Button onClick={() => generateCode()}>Generate App Code</Button>
                            {error}
                        </> : <p>This experiment could not be found. Please contact the experiment conductor.</p>}
                    </Card>
                </Col>
            }
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
    const fifteenMinutesFromNow = new Date(currentDate.getTime() + 60 * 60000);
    return fifteenMinutesFromNow;
};

