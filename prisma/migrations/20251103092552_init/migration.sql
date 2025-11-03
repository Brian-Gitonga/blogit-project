/*
  Warnings:

  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dateJoined` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `emailAddress` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `lastUpdated` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[EmailAddress]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Username]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `EmailAddress` to the `Users` table without a default value. This is not possible if the table is not empty.
  - The required column `Id` was added to the `Users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `LastUpdated` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Username` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[Users] DROP CONSTRAINT [Users_emailAddress_key];

-- DropIndex
ALTER TABLE [dbo].[Users] DROP CONSTRAINT [Users_username_key];

-- AlterTable
ALTER TABLE [dbo].[Users] DROP CONSTRAINT [Users_pkey];
ALTER TABLE [dbo].[Users] DROP COLUMN [dateJoined],
[emailAddress],
[id],
[isDeleted],
[lastUpdated],
[username];
ALTER TABLE [dbo].[Users] ADD CONSTRAINT Users_pkey PRIMARY KEY CLUSTERED ([Id]);
ALTER TABLE [dbo].[Users] ADD [DateJoined] DATETIME2 NOT NULL CONSTRAINT [Users_DateJoined_df] DEFAULT CURRENT_TIMESTAMP,
[EmailAddress] NVARCHAR(1000) NOT NULL,
[Id] NVARCHAR(1000) NOT NULL,
[IsDeleted] BIT NOT NULL CONSTRAINT [Users_IsDeleted_df] DEFAULT 0,
[LastUpdated] DATETIME2 NOT NULL,
[Username] NVARCHAR(1000) NOT NULL;

-- CreateIndex
ALTER TABLE [dbo].[Users] ADD CONSTRAINT [Users_EmailAddress_key] UNIQUE NONCLUSTERED ([EmailAddress]);

-- CreateIndex
ALTER TABLE [dbo].[Users] ADD CONSTRAINT [Users_Username_key] UNIQUE NONCLUSTERED ([Username]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
