import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/Tabs';
import RankingList from './RankingList';
import { ProcessedData, ResourceType } from '../types';

interface ResourceTabsProps {
  data: ProcessedData;
  onHallSelect: (hall: string) => void;
}

const ResourceTabs: React.FC<ResourceTabsProps> = ({ data, onHallSelect }) => {
  const resources: ResourceType[] = ['electricity', 'gas', 'water'];

  return (
    <Tabs defaultValue="electricity" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        {resources.map((resource) => (
          <TabsTrigger
            key={resource}
            value={resource}
            className="capitalize"
          >
            {resource}
          </TabsTrigger>
        ))}
      </TabsList>

      {resources.map((resource) => (
        <TabsContent key={resource} value={resource}>
          <RankingList
            data={data}
            resource={resource}
            onHallSelect={onHallSelect}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ResourceTabs;