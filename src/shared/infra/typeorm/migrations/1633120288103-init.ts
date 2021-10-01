import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1633120288103 implements MigrationInterface {
  name = 'init1633120288103';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "active" boolean NOT NULL DEFAULT true, "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying DEFAULT 'UNDEFINED', "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "updated_access" text, "inactivated_at" TIMESTAMP, "inactivated_by" character varying, "inactivated_access" text, "name" character varying NOT NULL, CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "active" boolean NOT NULL DEFAULT true, "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying DEFAULT 'UNDEFINED', "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "updated_access" text, "inactivated_at" TIMESTAMP, "inactivated_by" character varying, "inactivated_access" text, "name" character varying, "email" character varying NOT NULL, "subscribed" boolean NOT NULL, CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "senders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "active" boolean NOT NULL DEFAULT true, "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying DEFAULT 'UNDEFINED', "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "updated_access" text, "inactivated_at" TIMESTAMP, "inactivated_by" character varying, "inactivated_access" text, "name" character varying NOT NULL, "email" character varying NOT NULL, CONSTRAINT "UQ_1414ac64e9156a150b0c13de4b5" UNIQUE ("email"), CONSTRAINT "PK_398b8614004a406acf982651b46" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "templates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "active" boolean NOT NULL DEFAULT true, "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying DEFAULT 'UNDEFINED', "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "updated_access" text, "inactivated_at" TIMESTAMP, "inactivated_by" character varying, "inactivated_access" text, "name" character varying NOT NULL, "content" character varying NOT NULL, CONSTRAINT "PK_515948649ce0bbbe391de702ae5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "active" boolean NOT NULL DEFAULT true, "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying DEFAULT 'UNDEFINED', "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "updated_access" text, "inactivated_at" TIMESTAMP, "inactivated_by" character varying, "inactivated_access" text, "template_id" uuid, "sender_id" uuid NOT NULL, "subject" character varying NOT NULL, "body" character varying, "sent_at" TIMESTAMP, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "recipients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "active" boolean NOT NULL DEFAULT true, "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying DEFAULT 'UNDEFINED', "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "updated_access" text, "inactivated_at" TIMESTAMP, "inactivated_by" character varying, "inactivated_access" text, "message_id" uuid NOT NULL, "contact_id" uuid NOT NULL, CONSTRAINT "PK_de8fc5a9c364568f294798fe1e9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "active" boolean NOT NULL DEFAULT true, "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying DEFAULT 'UNDEFINED', "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "updated_access" text, "inactivated_at" TIMESTAMP, "inactivated_by" character varying, "inactivated_access" text, "type" character varying NOT NULL, "meta" text, "recipient_id" uuid NOT NULL, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "users_role_enum" AS ENUM('admin', 'client')`);
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "active" boolean NOT NULL DEFAULT true, "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying DEFAULT 'UNDEFINED', "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "updated_access" text, "inactivated_at" TIMESTAMP, "inactivated_by" character varying, "inactivated_access" text, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "users_role_enum" NOT NULL DEFAULT 'client', "lastAccess" text, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contacts_tags" ("contact_id" uuid NOT NULL, "tag_id" uuid NOT NULL, CONSTRAINT "PK_19febdfdd5f1f5c3492d7ee8f78" PRIMARY KEY ("contact_id", "tag_id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_f852029a1d759b5405a8a264bf" ON "contacts_tags" ("contact_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_48c3bbfaa2eb032ad7a7fc0840" ON "contacts_tags" ("tag_id") `);
    await queryRunner.query(
      `CREATE TABLE "messages_tags" ("messages_id" uuid NOT NULL, "tags_id" uuid NOT NULL, CONSTRAINT "PK_8daa5ef9a2f3e10c3dfa7b5201e" PRIMARY KEY ("messages_id", "tags_id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_9169cfc668a57d72a128a24361" ON "messages_tags" ("messages_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_16b7f2c33407e886ccb2499883" ON "messages_tags" ("tags_id") `);
    await queryRunner.query(
      `CREATE TABLE "messages_recipients" ("messages_id" uuid NOT NULL, "recipient_id" uuid NOT NULL, CONSTRAINT "PK_b14ee3524522e6481bac134cd70" PRIMARY KEY ("messages_id", "recipient_id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_eb9e38a6e131062d02f37e276b" ON "messages_recipients" ("messages_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_316951a129918816dbe3dac9bd" ON "messages_recipients" ("recipient_id") `);
    await queryRunner.query(
      `CREATE TABLE "recipients_events" ("recipient_id" uuid NOT NULL, "event_id" uuid NOT NULL, CONSTRAINT "PK_ed6611a1f5b63d34b676ade7cb0" PRIMARY KEY ("recipient_id", "event_id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_c40c6ad4cf58e6744d937880d8" ON "recipients_events" ("recipient_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_19bfbaadaa870c22054be72b1a" ON "recipients_events" ("event_id") `);
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_f7b87b9df16052b1b08eae2423b" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_22133395bd13b970ccd0c34ab22" FOREIGN KEY ("sender_id") REFERENCES "senders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "recipients" ADD CONSTRAINT "FK_0165d928b509eb6e71b09b78994" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "recipients" ADD CONSTRAINT "FK_64b4e877af3dc2cfe80efaa8b0b" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "FK_21902743d031e5b8bca037ba39c" FOREIGN KEY ("recipient_id") REFERENCES "recipients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contacts_tags" ADD CONSTRAINT "FK_f852029a1d759b5405a8a264bfb" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "contacts_tags" ADD CONSTRAINT "FK_48c3bbfaa2eb032ad7a7fc08404" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages_tags" ADD CONSTRAINT "FK_9169cfc668a57d72a128a24361f" FOREIGN KEY ("messages_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages_tags" ADD CONSTRAINT "FK_16b7f2c33407e886ccb24998830" FOREIGN KEY ("tags_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages_recipients" ADD CONSTRAINT "FK_eb9e38a6e131062d02f37e276bf" FOREIGN KEY ("messages_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages_recipients" ADD CONSTRAINT "FK_316951a129918816dbe3dac9bde" FOREIGN KEY ("recipient_id") REFERENCES "recipients"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "recipients_events" ADD CONSTRAINT "FK_c40c6ad4cf58e6744d937880d8f" FOREIGN KEY ("recipient_id") REFERENCES "recipients"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "recipients_events" ADD CONSTRAINT "FK_19bfbaadaa870c22054be72b1a4" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "recipients_events" DROP CONSTRAINT "FK_19bfbaadaa870c22054be72b1a4"`);
    await queryRunner.query(`ALTER TABLE "recipients_events" DROP CONSTRAINT "FK_c40c6ad4cf58e6744d937880d8f"`);
    await queryRunner.query(`ALTER TABLE "messages_recipients" DROP CONSTRAINT "FK_316951a129918816dbe3dac9bde"`);
    await queryRunner.query(`ALTER TABLE "messages_recipients" DROP CONSTRAINT "FK_eb9e38a6e131062d02f37e276bf"`);
    await queryRunner.query(`ALTER TABLE "messages_tags" DROP CONSTRAINT "FK_16b7f2c33407e886ccb24998830"`);
    await queryRunner.query(`ALTER TABLE "messages_tags" DROP CONSTRAINT "FK_9169cfc668a57d72a128a24361f"`);
    await queryRunner.query(`ALTER TABLE "contacts_tags" DROP CONSTRAINT "FK_48c3bbfaa2eb032ad7a7fc08404"`);
    await queryRunner.query(`ALTER TABLE "contacts_tags" DROP CONSTRAINT "FK_f852029a1d759b5405a8a264bfb"`);
    await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_21902743d031e5b8bca037ba39c"`);
    await queryRunner.query(`ALTER TABLE "recipients" DROP CONSTRAINT "FK_64b4e877af3dc2cfe80efaa8b0b"`);
    await queryRunner.query(`ALTER TABLE "recipients" DROP CONSTRAINT "FK_0165d928b509eb6e71b09b78994"`);
    await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_22133395bd13b970ccd0c34ab22"`);
    await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_f7b87b9df16052b1b08eae2423b"`);
    await queryRunner.query(`DROP INDEX "IDX_19bfbaadaa870c22054be72b1a"`);
    await queryRunner.query(`DROP INDEX "IDX_c40c6ad4cf58e6744d937880d8"`);
    await queryRunner.query(`DROP TABLE "recipients_events"`);
    await queryRunner.query(`DROP INDEX "IDX_316951a129918816dbe3dac9bd"`);
    await queryRunner.query(`DROP INDEX "IDX_eb9e38a6e131062d02f37e276b"`);
    await queryRunner.query(`DROP TABLE "messages_recipients"`);
    await queryRunner.query(`DROP INDEX "IDX_16b7f2c33407e886ccb2499883"`);
    await queryRunner.query(`DROP INDEX "IDX_9169cfc668a57d72a128a24361"`);
    await queryRunner.query(`DROP TABLE "messages_tags"`);
    await queryRunner.query(`DROP INDEX "IDX_48c3bbfaa2eb032ad7a7fc0840"`);
    await queryRunner.query(`DROP INDEX "IDX_f852029a1d759b5405a8a264bf"`);
    await queryRunner.query(`DROP TABLE "contacts_tags"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "users_role_enum"`);
    await queryRunner.query(`DROP TABLE "events"`);
    await queryRunner.query(`DROP TABLE "recipients"`);
    await queryRunner.query(`DROP TABLE "messages"`);
    await queryRunner.query(`DROP TABLE "templates"`);
    await queryRunner.query(`DROP TABLE "senders"`);
    await queryRunner.query(`DROP TABLE "contacts"`);
    await queryRunner.query(`DROP TABLE "tags"`);
  }
}
