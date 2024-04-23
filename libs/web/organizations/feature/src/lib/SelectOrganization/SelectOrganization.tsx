'use client';

import { Button, DropdownMenuItem } from '@promptus/web-shared-ui';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from '@promptus/web-shared-ui';
import styles from './SelectOrganization.module.scss';
import React, { useEffect } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { GetAccountOrgsQuery } from '@promptus/web/shared/data-access/server';
import { cn } from '@promptus/web/shared/util';

export interface BaseObject {
  id: string;
  name: string;
}
export interface Organization extends BaseObject {
  projects: Array<Project>;
}

export interface Project extends BaseObject {
  description?: string;
}

export interface SelectOrganizationProps {
  data: GetAccountOrgsQuery['getOrganizationsByAccountID'];
}

export interface DropdownItemContentProps {
  name: string;
  checked?: boolean;
}

export function DropdownItemContent({
  name,
  checked,
}: DropdownItemContentProps) {
  return (
    <>
      {checked && <Check size={16} />}
      <span className={cn('mr-3', checked ? `ml-3` : `ml-7`)}>{name}</span>
    </>
  );
}

export function SelectOrganization({ data }: SelectOrganizationProps) {
  const [selectedOrg, setSelectedOrg] = React.useState<Organization | null>(
    null
  );
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(
    null
  );

  useEffect(() => {
    if (data && data.length) {
      setSelectedOrg(data[0]);
    }
  }, [data]);

  const handleSelectOrg = (org: Organization) => {
    setSelectedOrg(org);
    setSelectedProject(null);
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
  };

  return (
    <div className={styles['container']}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {selectedOrg && (
            <Button variant="link">
              <span className="mr-3">{selectedOrg?.name}'s organization</span>
              <ChevronsUpDown></ChevronsUpDown>
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {data?.map((org) =>
            org.projects.length ? (
              <DropdownMenuSub key={org.id}>
                <DropdownMenuSubTrigger onClick={() => handleSelectOrg(org)}>
                  <DropdownItemContent
                    name={org.name}
                    checked={org.id === selectedOrg?.id}
                  />
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuLabel>Projects</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {org.projects.map((project) => (
                      <DropdownMenuItem
                        key={project.id}
                        onClick={() => handleSelectProject(project)}
                      >
                        <DropdownItemContent
                          name={project.name}
                          checked={project.id === selectedProject?.id}
                        />
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            ) : (
              <DropdownMenuItem
                key={org.id}
                onClick={() => handleSelectOrg(org)}
              >
                <DropdownItemContent
                  name={org.name}
                  checked={org.id === selectedOrg?.id}
                />
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default SelectOrganization;
