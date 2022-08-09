export const host = "http://localhost:8081";

export const Property = { 
    PROJECT: 'PROJECT', 
    STORAGE_FROM: 'STORAGE_FROM', 
    STORAGE_TO: 'STORAGE_TO',
    ADD_REST_FOR_HOLD: 'ADD_REST_FOR_HOLD',
    AVERAGE_COST : 'AVERAGE_COST' };

export const DocumentType = { 
    POSTING_DOC: 'Поступление',
    RECEIPT_DOC: 'Оприходование',
    MOVEMENT_DOC: 'Перемещение',
    WRITE_OFF_DOC: 'Списание',
    CHECK_DOC: 'Чек ККМ',
    CREDIT_ORDER_DOC: 'ПКО',
    WITHDRAW_ORDER_DOC: 'Расходный кассовый ордер',
    REQUEST_DOC: 'Заявка',
    INVENTORY_DOC: 'Инвентаризация'
};

export const PaymentType = { 
    TAX_PAYMENT: 'Оплата налога',
    CLIENT_PAYMENT: 'Оплата от покупателя',
    SUPPLIER_PAYMENT: 'Оплата поставщику',
    OTHER_PAYMENT: 'Прочее',
    SALARY_PAYMENT: 'Выплата заработной платы',
    SALE_CASH_PAYMENT: 'Выручка наличными',
    SALE_CARD_PAYMENT: 'Выручка по картам'
};

