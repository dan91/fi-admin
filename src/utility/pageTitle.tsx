import { Button, Col, Row } from "antd"
import Title from "antd/lib/typography/Title"
import { ReactNode } from "react"

interface PageTitleProps {
    title: string,
    titleLevel?: 1 | 5 | 2 | 3 | 4 | undefined
    buttonIcon?: ReactNode
    buttonText?: string
    buttonAction?: () => void
    buttonSize?: 'small' | 'middle' | 'large'
    otherButtons?: ReactNode
}

export const PageTitle: React.FC<PageTitleProps> = ({ title, titleLevel, buttonIcon, buttonAction, buttonText, buttonSize, otherButtons }) => {

    return <Row style={{ paddingTop: '24px' }}>
        <Col span={12}>
            <Title level={titleLevel ?? 4}>{title}</Title>
        </Col>
        <Col span={12}>
            {buttonAction && <Button style={{ float: "right" }} size={buttonSize ?? 'middle'} onClick={buttonAction}>{buttonIcon} {buttonText ?? 'Add'}</Button>}
            {otherButtons}
        </Col>
    </Row>
}