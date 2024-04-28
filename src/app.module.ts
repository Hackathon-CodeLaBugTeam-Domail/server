import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { join } from 'path';
import { IpfsModule } from './ipfs/ipfs.module';
import { DomainTransferModule } from './domain_transfer/domain_transfer.module';
import { BackupModule } from './backup/backup.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_POSTGRES_HOST'),
        port: parseInt(configService.get<string>('DATABASE_POSTGRES_PORT')),
        username: configService.get<string>('DATABASE_POSTGRES_USERNAME'),
        password: configService.get<string>('DATABASE_POSTGRES_PASSWORD'),
        database: configService.get<string>('DATABASE_POSTGRES_NAME'),
        autoLoadEntities: true,
        synchronize: configService.get<string>('NODE_ENV') === 'development',
        migrationsTableName: 'migrations',
        migrations: [join(__dirname, '..', 'database/migrations/*{.js,.ts}')],
        seeds: [join(__dirname, '..', 'database/seeds/*{.js,.ts}')],
        factories: [join(__dirname, '..', 'database/factories/*{.js,.ts}')],
        subscribers: [join(__dirname, '..', 'modules/**/*.subscriber.{ts,js}')],
      }),
    }),
    AuthModule,
    UserModule,
    IpfsModule,
    DomainTransferModule,
    BackupModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
