import { Card, Row, Col, Button } from 'antd';
import { Link } from 'umi';

export default function HomePage() {
  return (
    <div style={{ verticalAlign: 'middle', margin: 300 }}>
      <Row gutter={160}>
        <Col span={8}>
          <Card title="业务编排清单" bordered={false}>
            <Link to={'/logics'}> <Button>点击查看</Button></Link>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Card title">
            Card content
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Card title">
            Card content
          </Card>
        </Col>
      </Row>
    </div>
  );
}
