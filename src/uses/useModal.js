import { createVNode } from 'vue';
import { Modal, notification } from 'ant-design-vue';
import { LinkOutlined, SmileOutlined } from '@ant-design/icons-vue';
import { BROWSER_URL_OF_TRANCATION } from 'config';

/**
 * Modal Content with txn
 */
const TransacationContentBody = async (txn) => {
  return createVNode(
    'p',
    {
      className: 'txn-noti',
    },
    [
      'Trasaction Broswer Link: ',
      createVNode(
        'a',
        {
          href: await BROWSER_URL_OF_TRANCATION(txn),
          target: '_blank',
        },
        [createVNode(LinkOutlined), txn],
      ),
    ],
  );
};

export default () => {
  //
  const openTxnModal = async (txn) => {
    Modal.info({
      centered: true,
      width: '480px',
      title: 'Transcation Submit!',
      content: await TransacationContentBody(txn),
      okText: 'OK',
    });
  };

  //
  const openTxnCheckedNotification = async (txn) => {
    notification.open({
      message: 'Transcation Success!',
      description: await TransacationContentBody(txn),
      icon: createVNode(SmileOutlined, { style: 'color: #108ee9' }),
    });
  };

  return {
    openTxnModal,
    openTxnCheckedNotification,
  };
};
