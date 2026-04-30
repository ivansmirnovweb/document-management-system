import 'dotenv/config';
import bcrypt from 'bcrypt';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { documentAuditLogs } from './schema/document-audit-logs';
import { documents } from './schema/documents';
import { employers } from './schema/employers';
import { users } from './schema/users';

const DEFAULT_PASSWORD = 'ChangeMe123!';

async function seed(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  try {
    const auditTableExists = await hasTable(db, 'document_audit_logs');

    if (auditTableExists) {
      await db.delete(documentAuditLogs);
    }

    await db.delete(documents);
    await db.delete(employers);
    await db.delete(users);

    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    const now = new Date();

    const [rootUser] = await db
      .insert(users)
      .values({
        username: 'root',
        displayName: 'System Root',
        unit: 'Администрация',
        role: 'ROOT',
        passwordHash,
        passwordChangedAt: null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    const regularUsers = await db
      .insert(users)
      .values([
        {
          username: 'ivanov',
          displayName: 'Иванов Иван Иванович',
          unit: 'Юридический отдел',
          role: 'USER',
          passwordHash,
          passwordChangedAt: null,
          createdAt: now,
          updatedAt: now,
        },
        {
          username: 'petrova',
          displayName: 'Петрова Анна Сергеевна',
          unit: 'Канцелярия',
          role: 'USER',
          passwordHash,
          passwordChangedAt: null,
          createdAt: now,
          updatedAt: now,
        },
        {
          username: 'sidorov',
          displayName: 'Сидоров Максим Олегович',
          unit: 'Канцелярия',
          role: 'USER',
          passwordHash,
          passwordChangedAt: null,
          createdAt: now,
          updatedAt: now,
        },
        {
          username: 'smirnova',
          displayName: 'Смирнова Елена Викторовна',
          unit: 'Отдел снабжения',
          role: 'USER',
          passwordHash,
          passwordChangedAt: null,
          createdAt: now,
          updatedAt: now,
        },
        {
          username: 'kozlov',
          displayName: 'Козлов Дмитрий Павлович',
          unit: 'Бухгалтерия',
          role: 'USER',
          passwordHash,
          passwordChangedAt: null,
          createdAt: now,
          updatedAt: now,
        },
        {
          username: 'fedorova',
          displayName: 'Федорова Ольга Николаевна',
          unit: 'Отдел кадров',
          role: 'USER',
          passwordHash,
          passwordChangedAt: null,
          createdAt: now,
          updatedAt: now,
        },
      ])
      .returning();

    const [
      userIvanov,
      userPetrova,
      userSidorov,
      userSmirnova,
      userKozlov,
      userFedorova,
    ] = regularUsers;

    const insertedEmployers = await db
      .insert(employers)
      .values([
        {
          fullName: 'ООО "Северный Логистический Центр"',
          shortName: 'ООО "СЛЦ"',
          legalAddress: 'г. Москва, ул. Складская, д. 12',
          actualAddress: 'г. Москва, ул. Складская, д. 12',
          createdAt: now,
          updatedAt: now,
        },
        {
          fullName: 'АО "ВостокЭнергоСбыт"',
          shortName: 'АО "ВЭС"',
          legalAddress: 'г. Казань, пр-т Победы, д. 44',
          actualAddress: 'г. Казань, пр-т Победы, д. 46',
          createdAt: now,
          updatedAt: now,
        },
        {
          fullName: 'ПАО "Городские Теплосети"',
          shortName: 'ПАО "ГТС"',
          legalAddress: 'г. Самара, ул. Набережная, д. 3',
          actualAddress: 'г. Самара, ул. Набережная, д. 3',
          createdAt: now,
          updatedAt: now,
        },
        {
          fullName: 'ГБУ "Центр Инфраструктурных Проектов"',
          shortName: 'ГБУ "ЦИП"',
          legalAddress: 'г. Санкт-Петербург, ул. Морская, д. 18',
          actualAddress: 'г. Санкт-Петербург, ул. Морская, д. 20',
          createdAt: now,
          updatedAt: now,
        },
        {
          fullName: 'ООО "Альфа-Строй Комплект"',
          shortName: 'ООО "АСК"',
          legalAddress: 'г. Екатеринбург, ул. Машиностроителей, д. 9',
          actualAddress: 'г. Екатеринбург, ул. Машиностроителей, д. 11',
          createdAt: now,
          updatedAt: now,
        },
        {
          fullName: 'ИП Захаров Петр Андреевич',
          shortName: 'ИП Захаров П.А.',
          legalAddress: 'г. Нижний Новгород, ул. Центральная, д. 5',
          actualAddress: 'г. Нижний Новгород, ул. Центральная, д. 5',
          createdAt: now,
          updatedAt: now,
        },
      ])
      .returning();

    const [slc, ves, gts, cip, ask, zakharov] = insertedEmployers;

    const insertedDocuments = await db
      .insert(documents)
      .values([
        {
          registrationNumber: 'REG-2026-0001',
          registrationDate: new Date('2026-01-10T08:00:00.000Z'),
          title: 'Проверка проекта договора поставки',
          about1: 'Проверка проекта договора поставки',
          about2: 'Подготовка правового заключения по пунктам ответственности',
          kind: 'INCOMING',
          description: 'Подготовить юридические замечания и согласовать с отделом снабжения.',
          incomingNumber: 'ВХ-501',
          outgoingNumber: null,
          employerId: slc.id,
          outSenderEmployerId: slc.id,
          broadcast: 'Юридический отдел; Отдел снабжения',
          ownerId: rootUser.id,
          executorId: userIvanov.id,
          status: 'NOT_DONE',
          dueDate: new Date('2026-05-12T09:00:00.000Z'),
          isControl: false,
          deletedAt: null,
          createdAt: now,
          updatedAt: now,
          lastChangedAt: now,
          lastChangedById: rootUser.id,
        },
        {
          registrationNumber: 'REG-2026-0002',
          registrationDate: new Date('2026-01-12T09:00:00.000Z'),
          title: 'Согласование пакета закрывающих документов',
          about1: 'Согласование пакета закрывающих документов',
          about2: 'Проверка счетов и актов',
          kind: 'OUTGOING',
          description: 'Проверить корректность счетов и направить контрагенту подтверждение.',
          incomingNumber: null,
          outgoingNumber: 'ИСХ-9002',
          outgoingDate: new Date('2026-01-30T10:00:00.000Z'),
          employerId: ves.id,
          outSenderEmployerId: ves.id,
          broadcast: 'Бухгалтерия',
          ownerId: userIvanov.id,
          executorId: userKozlov.id,
          status: 'DONE',
          dueDate: new Date('2026-02-01T09:00:00.000Z'),
          completedAt: new Date('2026-01-30T10:00:00.000Z'),
          isControl: false,
          deletedAt: null,
          createdAt: now,
          updatedAt: now,
          lastChangedAt: now,
          lastChangedById: rootUser.id,
        },
        {
          registrationNumber: 'REG-2026-0003',
          registrationDate: new Date('2026-01-15T10:00:00.000Z'),
          title: 'Подготовка ответа на запрос надзорного органа',
          about1: 'Подготовка ответа на запрос надзорного органа',
          about2: 'Сбор пояснений и подтверждающих материалов',
          kind: 'INCOMING',
          description: 'Сформировать ответ и проект сопроводительного письма.',
          incomingNumber: 'ВХ-503',
          outgoingNumber: null,
          employerId: gts.id,
          outSenderEmployerId: gts.id,
          broadcast: 'Канцелярия; Юридический отдел',
          ownerId: userPetrova.id,
          executorId: userSidorov.id,
          status: 'NOT_DONE',
          dueDate: new Date('2026-04-28T09:00:00.000Z'),
          isControl: true,
          deletedAt: null,
          createdAt: now,
          updatedAt: now,
          lastChangedAt: now,
          lastChangedById: rootUser.id,
        },
        {
          registrationNumber: 'REG-2026-0004',
          registrationDate: new Date('2026-01-18T09:00:00.000Z'),
          title: 'Внутренняя служебная записка по регламенту архива',
          about1: 'Внутренняя служебная записка по регламенту архива',
          about2: 'Обновление внутренних правил хранения',
          kind: 'INTERNAL',
          description: 'Довести новый порядок хранения дел до подразделений.',
          incomingNumber: null,
          outgoingNumber: null,
          employerId: null,
          outSenderEmployerId: null,
          broadcast: 'Все подразделения',
          ownerId: userSidorov.id,
          executorId: userFedorova.id,
          status: 'NOT_DONE',
          dueDate: new Date('2026-05-12T09:00:00.000Z'),
          isControl: false,
          deletedAt: null,
          createdAt: now,
          updatedAt: now,
          lastChangedAt: now,
          lastChangedById: rootUser.id,
        },
        {
          registrationNumber: 'REG-2026-0005',
          registrationDate: new Date('2026-01-20T09:00:00.000Z'),
          title: 'Архивная карточка с мягким удалением',
          about1: 'Архивная карточка с мягким удалением',
          about2: 'Проверка сценария восстановления удаленных',
          kind: 'INCOMING',
          description: 'Документ удален для проверки восстановления root-пользователем.',
          incomingNumber: 'ВХ-505',
          outgoingNumber: null,
          employerId: slc.id,
          outSenderEmployerId: slc.id,
          broadcast: 'Архив',
          ownerId: rootUser.id,
          executorId: userPetrova.id,
          status: 'DONE',
          dueDate: new Date('2026-02-15T09:00:00.000Z'),
          completedAt: new Date('2026-02-14T11:00:00.000Z'),
          isControl: false,
          deletedAt: new Date('2026-03-01T08:30:00.000Z'),
          createdAt: now,
          updatedAt: now,
          lastChangedAt: now,
          lastChangedById: rootUser.id,
        },
        {
          registrationNumber: 'REG-2026-0006',
          registrationDate: new Date('2026-02-02T09:00:00.000Z'),
          title: 'Запрос коммерческого предложения на оргтехнику',
          about1: 'Запрос коммерческого предложения на оргтехнику',
          about2: 'Сбор цен и условий поставки',
          kind: 'OUTGOING',
          description: 'Направить запросы трем поставщикам и собрать ответы.',
          incomingNumber: null,
          outgoingNumber: 'ИСХ-9011',
          outgoingDate: new Date('2026-02-02T12:00:00.000Z'),
          employerId: ask.id,
          outSenderEmployerId: ask.id,
          broadcast: 'Отдел снабжения; Бухгалтерия',
          ownerId: userSmirnova.id,
          executorId: userSmirnova.id,
          status: 'DONE',
          dueDate: new Date('2026-02-10T09:00:00.000Z'),
          completedAt: new Date('2026-02-09T14:00:00.000Z'),
          isControl: false,
          deletedAt: null,
          createdAt: now,
          updatedAt: now,
          lastChangedAt: now,
          lastChangedById: userSmirnova.id,
        },
        {
          registrationNumber: 'REG-2026-0007',
          registrationDate: new Date('2026-02-05T10:00:00.000Z'),
          title: 'План-график отпусков на второе полугодие',
          about1: 'План-график отпусков на второе полугодие',
          about2: 'Согласование графика по подразделениям',
          kind: 'INTERNAL',
          description: 'Собрать предложения руководителей и утвердить график.',
          incomingNumber: null,
          outgoingNumber: null,
          employerId: null,
          outSenderEmployerId: null,
          broadcast: 'Отдел кадров; Руководители подразделений',
          ownerId: userFedorova.id,
          executorId: userFedorova.id,
          status: 'NOT_DONE',
          dueDate: new Date('2026-05-20T09:00:00.000Z'),
          isControl: true,
          deletedAt: null,
          createdAt: now,
          updatedAt: now,
          lastChangedAt: now,
          lastChangedById: userFedorova.id,
        },
        {
          registrationNumber: 'REG-2026-0008',
          registrationDate: new Date('2026-02-11T08:30:00.000Z'),
          title: 'Претензия по нарушению сроков поставки',
          about1: 'Претензия по нарушению сроков поставки',
          about2: 'Подготовка досудебного письма',
          kind: 'OUTGOING',
          description: 'Подготовить и отправить претензионное письмо поставщику.',
          incomingNumber: null,
          outgoingNumber: 'ИСХ-9020',
          outgoingDate: null,
          employerId: slc.id,
          outSenderEmployerId: slc.id,
          broadcast: 'Юридический отдел',
          ownerId: userIvanov.id,
          executorId: userIvanov.id,
          status: 'NOT_DONE',
          dueDate: new Date('2026-05-03T10:00:00.000Z'),
          isControl: true,
          deletedAt: null,
          createdAt: now,
          updatedAt: now,
          lastChangedAt: now,
          lastChangedById: userIvanov.id,
        },
        {
          registrationNumber: 'REG-2026-0009',
          registrationDate: new Date('2026-02-15T11:00:00.000Z'),
          title: 'Акт сверки взаиморасчетов за I квартал',
          about1: 'Акт сверки взаиморасчетов за I квартал',
          about2: 'Проверка оборотов и расхождений',
          kind: 'INCOMING',
          description: 'Сверить суммы и подписать акт без разногласий.',
          incomingNumber: 'ВХ-527',
          outgoingNumber: null,
          employerId: ves.id,
          outSenderEmployerId: ves.id,
          broadcast: 'Бухгалтерия',
          ownerId: userKozlov.id,
          executorId: userKozlov.id,
          status: 'DONE',
          dueDate: new Date('2026-03-05T10:00:00.000Z'),
          completedAt: new Date('2026-03-01T13:00:00.000Z'),
          isControl: false,
          deletedAt: null,
          createdAt: now,
          updatedAt: now,
          lastChangedAt: now,
          lastChangedById: userKozlov.id,
        },
        {
          registrationNumber: 'REG-2026-0010',
          registrationDate: new Date('2026-02-20T09:30:00.000Z'),
          title: 'Обращение гражданина о предоставлении информации',
          about1: 'Обращение гражданина о предоставлении информации',
          about2: 'Ответ по срокам и порядку рассмотрения',
          kind: 'INCOMING',
          description: 'Подготовить официальный ответ и направить в установленный срок.',
          incomingNumber: 'ВХ-534',
          outgoingNumber: null,
          employerId: zakharov.id,
          outSenderEmployerId: zakharov.id,
          broadcast: 'Канцелярия',
          ownerId: userPetrova.id,
          executorId: userSidorov.id,
          status: 'NOT_DONE',
          dueDate: new Date('2026-05-01T09:00:00.000Z'),
          isControl: false,
          deletedAt: null,
          createdAt: now,
          updatedAt: now,
          lastChangedAt: now,
          lastChangedById: userPetrova.id,
        },
        {
          registrationNumber: 'REG-2026-0011',
          registrationDate: new Date('2026-02-25T09:00:00.000Z'),
          title: 'Согласование сметы на ремонт серверной',
          about1: 'Согласование сметы на ремонт серверной',
          about2: 'Проверка стоимости и сроков',
          kind: 'INTERNAL',
          description: 'Согласовать бюджет и календарный план с IT-отделом.',
          incomingNumber: null,
          outgoingNumber: null,
          employerId: null,
          outSenderEmployerId: null,
          broadcast: 'Администрация; Бухгалтерия',
          ownerId: rootUser.id,
          executorId: userKozlov.id,
          status: 'DONE',
          dueDate: new Date('2026-03-20T09:00:00.000Z'),
          completedAt: new Date('2026-03-18T16:00:00.000Z'),
          isControl: true,
          deletedAt: null,
          createdAt: now,
          updatedAt: now,
          lastChangedAt: now,
          lastChangedById: rootUser.id,
        },
        {
          registrationNumber: 'REG-2026-0012',
          registrationDate: new Date('2026-03-03T12:00:00.000Z'),
          title: 'Уведомление о смене банковских реквизитов',
          about1: 'Уведомление о смене банковских реквизитов',
          about2: 'Обновление данных в учетной системе',
          kind: 'INCOMING',
          description: 'Проверить реквизиты и внести изменения в карточку контрагента.',
          incomingNumber: 'ВХ-548',
          outgoingNumber: null,
          employerId: cip.id,
          outSenderEmployerId: cip.id,
          broadcast: 'Бухгалтерия',
          ownerId: userKozlov.id,
          executorId: userKozlov.id,
          status: 'DONE',
          dueDate: new Date('2026-03-10T09:00:00.000Z'),
          completedAt: new Date('2026-03-05T10:00:00.000Z'),
          isControl: false,
          deletedAt: new Date('2026-03-12T09:30:00.000Z'),
          createdAt: now,
          updatedAt: now,
          lastChangedAt: now,
          lastChangedById: rootUser.id,
        },
      ])
      .returning();

    if (auditTableExists) {
      await db.insert(documentAuditLogs).values([
        {
          documentId: insertedDocuments[0].id,
          changedById: rootUser.id,
          action: 'DOCUMENT_CREATED',
          changes: { status: 'NOT_DONE' },
          createdAt: now,
        },
        {
          documentId: insertedDocuments[1].id,
          changedById: userKozlov.id,
          action: 'STATUS_CHANGED',
          changes: { from: 'NOT_DONE', to: 'DONE' },
          createdAt: now,
        },
        {
          documentId: insertedDocuments[2].id,
          changedById: userPetrova.id,
          action: 'CONTROL_ASSIGNED',
          changes: { isControl: true },
          createdAt: now,
        },
        {
          documentId: insertedDocuments[5].id,
          changedById: userSmirnova.id,
          action: 'STATUS_CHANGED',
          changes: { from: 'NOT_DONE', to: 'DONE' },
          createdAt: now,
        },
        {
          documentId: insertedDocuments[7].id,
          changedById: userIvanov.id,
          action: 'DOCUMENT_UPDATED',
          changes: { outgoingNumber: 'ИСХ-9020' },
          createdAt: now,
        },
        {
          documentId: insertedDocuments[4].id,
          changedById: rootUser.id,
          action: 'SOFT_DELETED',
          changes: { deletedAt: '2026-03-01T08:30:00.000Z' },
          createdAt: now,
        },
        {
          documentId: insertedDocuments[11].id,
          changedById: rootUser.id,
          action: 'SOFT_DELETED',
          changes: { deletedAt: '2026-03-12T09:30:00.000Z' },
          createdAt: now,
        },
      ]);
    }

    console.log('Database seed completed successfully.');
  } finally {
    await pool.end();
  }
}

seed().catch((error: unknown) => {
  console.error('Database seed failed:', error);
  process.exit(1);
});

async function hasTable(
  db: ReturnType<typeof drizzle>,
  tableName: string,
): Promise<boolean> {
  const result = await db.execute<{ exists: string | null }>(
    sql`select to_regclass(${`public.${tableName}`}) as exists`,
  );
  return result.rows[0]?.exists !== null;
}
