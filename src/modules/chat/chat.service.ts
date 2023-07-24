import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { OpenAI } from 'src/providers/openAi';
import { CondominiumsService } from '../condominiums/condominiums.service';
import { RequirementTypesService } from '../requirement-types/requirement-types.service';
import { RequirementsService } from '../requirements/requirements.service';
import { UsersService } from '../users/users.service';
import { ChatDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly openAi: OpenAI,
    private readonly usersService: UsersService,
    private readonly requirementsService: RequirementsService,
    private readonly requirementTypesService: RequirementTypesService,
    private readonly condominiumsService: CondominiumsService,
  ) {}

  async chat(chatDto: ChatDto): Promise<any> {
    const api = this.openAi.get();

    const response = await api
      .createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: chatDto.messages,
        functions: [
          {
            name: 'findUserByEmail',
            description:
              'returns an object of the user found. One of the properties of a user is units, which is an array of units this particular user is registerd for with the following properties: _id, number, type, block, condominium and condition.',
            parameters: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  description: 'The email of the user to find',
                },
              },
              required: ['email'],
            },
          },
          {
            name: 'createRequest',
            description:
              'It creates a new request or PQR for the user. The unit field receives the unit._id value, not the number value.',
            parameters: {
              type: 'object',
              properties: {
                requirementType: {
                  type: 'string',
                  description:
                    'The type of requirement to create for this particular condominium',
                },
                description: {
                  type: 'string',
                  description:
                    'The content of the requirement to create. Cannot be an empty string',
                },
                unit: {
                  type: 'string',
                  description:
                    'The _id of the unit to assign the requirement. Units are assigned to condominiums. The units assign to this user can be found in the user object',
                },
                user: {
                  type: 'object',
                  description: 'Create user Dto',
                  properties: {
                    _id: {
                      type: 'string',
                      description:
                        'The _id of the user to assign the requirement',
                    },
                  },
                },
              },
              required: ['user', 'unit', 'description', 'requirementType'],
            },
          },
          {
            name: 'findRequirementTypesByCondominium',
            description:
              'Every condominium has a set of requirement types. This function returns an array of types.',
            parameters: {
              type: 'object',
              properties: {
                _id: {
                  type: 'string',
                  description:
                    'The _id of the condominium to find the requirement types for',
                },
              },
              required: ['_id'],
            },
          },
          {
            name: 'findEveryCondominium',
            description: `Find every condominium in the database and returns an array of condominiums with the following properties: _id, account, address, unitQty, name, email, blocks, nit, verificationDigit, recepcionPhoneNumber `,
            parameters: {
              type: 'object',
              properties: {},
            },
          },
        ],
      })
      .catch((error: any) => {
        Logger.error(error);
        throw new InternalServerErrorException(error.message);
      });

    const { function_call } = response.data.choices[0].message || {};

    if (function_call) {
      response.data = await this.callFunction(
        function_call.name,
        JSON.parse(function_call.arguments),
      )
        .then(async (response: any) => {
          chatDto.messages.push({
            role: 'system',
            content: `${response.message}. This is the data: ${response.data}`,
          });

          console.log('Success =>', chatDto.messages);

          return await this.chat(chatDto);
        })
        .catch(async (error: any) => {
          chatDto.messages.push({
            role: 'system',
            content: error.message,
          });
          console.log('Error =>', chatDto.messages);
          return await this.chat(chatDto);
        });
    }

    console.log('Regular response =>', response.data);
    return response.data;
  }

  async callFunction(functionName: string, parameters: any) {
    switch (functionName) {
      case 'findUserByEmail':
        const response1 = await this.usersService.findUserByEmail(
          parameters.email,
        );

        console.log('user=>', response1.units);
        return {
          message: `The user with the provided email was found`,
          data: JSON.stringify(response1),
        };
      case 'createRequest':
        console.log(functionName, parameters);
        const response2 = await this.requirementsService.createRequest(
          parameters,
        );

        console.log(response2);

        return {
          message: `Request created successfully`,
          data: JSON.stringify(response2),
        };

      case 'findRequirementTypesByCondominium':
        console.log(functionName, parameters);

        const response3 =
          await this.requirementTypesService.findRequirementTypesByCondominium(
            parameters,
          );

        console.log(response3);

        return {
          message: `Requirement types found successfully`,
          data: JSON.stringify(response3),
        };

      case 'findEveryCondominium':
        console.log(functionName, parameters);

        const response4 = await this.condominiumsService.findEveryCondominium();

        return {
          message: `Condominiums found successfully`,
          data: JSON.stringify(response4),
        };
      default:
        return;
    }
  }
}
