import { useEffect, useState } from 'react'
import { Button, Card, Form, Input, message, Modal, Space, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined, MinusCircleOutlined } from '@ant-design/icons'
import type { Statistic } from './types'
import { getStatistics, saveStatistics } from './api'

const { Title } = Typography

const StatisticsPage = () => {
  const [loading, setLoading] = useState(false)
  const [statistics, setStatistics] = useState<Statistic[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingStatistic, setEditingStatistic] = useState<Statistic | null>(null)
  const [form] = Form.useForm()

  const loadStatistics = async () => {
    setLoading(true)
    try {
      const response = await getStatistics()
      setStatistics(response.data || [])
    } catch (error) {
      console.error(error)
      message.error('Failed to load statistics. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStatistics()
  }, [])

  const handleEdit = (record: Statistic) => {
    setEditingStatistic(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleAdd = () => {
    setEditingStatistic(null)
    form.resetFields()
    form.setFieldsValue({
      content: []
    })
    setModalVisible(true)
  }

  const handleDelete = async (record: Statistic) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: `Are you sure you want to delete "${record.title}"?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const updatedStatistics = statistics.filter(s => s.title !== record.title)
          await saveStatistics(updatedStatistics)
          setStatistics(updatedStatistics)
          message.success('Statistic deleted successfully')
        } catch (error) {
          console.error(error)
          message.error('Failed to delete statistic')
        }
      },
    })
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingStatistic) {
        const updatedStatistics = statistics.map(s => s.title === editingStatistic.title ? { ...s, ...values } : s)
        await saveStatistics(updatedStatistics)
        setStatistics(updatedStatistics)
        message.success('Statistic updated successfully')
      } else {
        const newStatistic: Statistic = {
          ...values,
          content: values.content || [],
        }
        const updatedStatistics = [...statistics, newStatistic]
        await saveStatistics(updatedStatistics)
        setStatistics(updatedStatistics)
        message.success('Statistic created successfully')
      }
      setModalVisible(false)
      form.resetFields()
    } catch (error) {
      console.error(error)
      message.error('Failed to save statistic')
    }
  }

  const columns: ColumnsType<Statistic> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Title level={3}>Statistics Management</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Statistic
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={statistics}
          rowKey="title"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </Card>

      <Modal
        title={editingStatistic ? 'Edit Statistic' : 'Add Statistic'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
        width={800}
        style={{ top: 20 }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input title' }]}
          >
            <Input placeholder="Title" />
          </Form.Item>
          <Form.List name="content">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} size="small" style={{ marginBottom: 16 }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'type']}
                      label="Type"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Type" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'title']}
                      label="Title"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Title" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'titleAlign']}
                      label="Title Align"
                    >
                      <Input placeholder="Title Align" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'titleMargin']}
                      label="Title Margin"
                    >
                      <Input placeholder="Title Margin" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'backgroundImage']}
                      label="Background Image"
                    >
                      <Input placeholder="Background Image" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'index']}
                      label="Index"
                    >
                      <Input type="number" placeholder="Index" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'subtitle']}
                      label="Subtitle"
                    >
                      <Input placeholder="Subtitle" />
                    </Form.Item>
                    <Button type="link" danger onClick={() => remove(name)}>
                      <MinusCircleOutlined /> Remove Section
                    </Button>
                  </Card>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Section
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  )
}

export default StatisticsPage
