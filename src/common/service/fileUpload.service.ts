import { Injectable } from "@nestjs/common";
import { cloudinaryConfig } from "../cloudinary/cloudinary";
import { UploadApiOptions } from "cloudinary";
import { retry } from "rxjs";
import { object } from "zod";


@Injectable()
export class FileUploadService {
    constructor() { }
    private cloudinary = cloudinaryConfig()

    async uploadFile(file: Express.Multer.File, options: UploadApiOptions) {
        return this.cloudinary.uploader.upload(file.path, options)
    }

    async uploadFiles(files: Express.Multer.File[], options: UploadApiOptions) {

        let results: { secure_url: string, public_id: string }[] = [];
        for (const file of files) {
            const { secure_url, public_id } = await this.uploadFile(file, options)
            results.push({ secure_url, public_id })
        }
        return results
    }

    async deleteFile(public_id: string) {
        return await this.cloudinary.uploader.destroy(public_id)
    }

    async deleteFolder(filePath: string) {
        await this.cloudinary.api.delete_resources_by_prefix(filePath)
        await this.cloudinary.api.delete_folder(filePath)
    }

}